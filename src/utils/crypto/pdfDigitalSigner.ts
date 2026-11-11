/**
 * Digital Profile Document Security Engine - PDF Native Digital Signer (PKCS#7 / PAdES)
 * Menyematkan tanda tangan digital kriptografi standar Adobe PPKLite (/ByteRange & /Contents)
 * langsung ke struktur biner PDF sehingga terverifikasi sah di Adobe Reader dan PDF Viewers.
 */

import { PDFDocument, PDFName, PDFHexString, PDFString } from 'pdf-lib';
import {
  DIGITAL_SIGNATURE_CONFIG,
  DigitalSignatureProfile,
  SignatureMetadataConfig,
} from '../../config/config-esign';
import { createDetachedPkcs7Signature, getOrCreateSigningCredentials } from './certGenerator';

export interface SignPdfOptions {
  level?: 'MASTER_DOSSIER' | 'UNIT_CREDENTIAL';
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  reason?: string;
  location?: string;
  contactInfo?: string;
  signerName?: string;
  signingTime?: Date;
  authorityProfile?: DigitalSignatureProfile;
  signerProfile?: DigitalSignatureProfile;
}

// 8192 karakter heksadesimal = 4096 byte alokasi untuk struktur sertifikat X.509 + PKCS#7
const SIGNATURE_HEX_LENGTH = 8192;

/**
 * Menandatangani berkas PDF biner (Uint8Array / ArrayBuffer) dengan Tanda Tangan Kriptografi
 * standar PKCS#7 / PAdES detached signature.
 */
export async function signPdfBuffer(
  inputPdfBytes: Uint8Array | ArrayBuffer,
  options: SignPdfOptions = {}
): Promise<Uint8Array> {
  const level = options.level || 'UNIT_CREDENTIAL';
  const levelConfig: SignatureMetadataConfig =
    level === 'MASTER_DOSSIER'
      ? DIGITAL_SIGNATURE_CONFIG.levels.masterDossier
      : DIGITAL_SIGNATURE_CONFIG.levels.unitCredential;

  const reason = options.reason || levelConfig.reason;
  const location = options.location || levelConfig.location;
  const contactInfo = options.contactInfo || levelConfig.contactInfo;
  const signingTime = options.signingTime || new Date();
  const authorityProfile = options.authorityProfile || DIGITAL_SIGNATURE_CONFIG.authority;
  const signerProfile = options.signerProfile || DIGITAL_SIGNATURE_CONFIG.signer;

  // 1. Muat dokumen PDF menggunakan pdf-lib
  const pdfDoc = await PDFDocument.load(inputPdfBytes);

  // Sematkan Metadata Dokumen Lengkap (Title, Author, Subject, Keywords, Producer, Creator)
  const docTitle = options.title || reason || 'Dokumen Resmi Alvareza Hilka Pratama';
  const docAuthor = options.author || options.signerName || signerProfile.commonName;
  const docSubject = options.subject || reason;
  const docKeywords = options.keywords || [
    'Digital Profile',
    'Verified Credential',
    'PAdES',
    'PDF Digital Signature',
    authorityProfile.commonName,
    signerProfile.commonName,
  ];

  pdfDoc.setTitle(docTitle);
  pdfDoc.setAuthor(docAuthor);
  pdfDoc.setSubject(docSubject);
  pdfDoc.setKeywords(docKeywords);
  pdfDoc.setCreator('Digital Profile Security Engine');
  pdfDoc.setProducer('Digital Profile PAdES Digital Signature Engine');
  pdfDoc.setCreationDate(signingTime);
  pdfDoc.setModificationDate(signingTime);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0] || pdfDoc.addPage([595.28, 841.89]);

  // Placeholder ByteRange dengan lebar karakter tetap (padded)
  const byteRangePlaceholder = [0, 1000000000, 1000000000, 1000000000];

  // 2. Buat Kamus Tanda Tangan /Type /Sig
  const sigDict = pdfDoc.context.obj({
    Type: 'Sig',
    Filter: DIGITAL_SIGNATURE_CONFIG.crypto.filter,
    SubFilter: DIGITAL_SIGNATURE_CONFIG.crypto.subFilter,
    ByteRange: byteRangePlaceholder,
    Contents: PDFHexString.of('0'.repeat(SIGNATURE_HEX_LENGTH)),
    Reason: PDFString.of(reason),
    M: PDFString.fromDate(signingTime),
    ContactInfo: PDFString.of(contactInfo),
    Location: PDFString.of(location),
    Name: PDFString.of(signerProfile.commonName),
  });

  const sigDictRef = pdfDoc.context.register(sigDict);

  // 3. Buat Widget Anotasi Field /FT /Sig
  const fieldTitle = `${levelConfig.signatureFieldTitle}_${Date.now()}`;
  const widgetDict = pdfDoc.context.obj({
    Type: 'Annot',
    Subtype: 'Widget',
    FT: 'Sig',
    Rect: [0, 0, 0, 0], // Invisible signature widget sesuai standar korporat
    V: sigDictRef,
    T: PDFString.of(fieldTitle),
    F: 4, // Print flag
    P: firstPage.ref,
  });

  const widgetDictRef = pdfDoc.context.register(widgetDict);

  // Pasang anotasi ke halaman pertama
  const existingAnnots = firstPage.node.lookup(PDFName.of('Annots'));
  if (existingAnnots) {
    try {
      const annotsArray = existingAnnots as any;
      if (typeof annotsArray.push === 'function') {
        annotsArray.push(widgetDictRef);
      }
    } catch {
      firstPage.node.set(PDFName.of('Annots'), pdfDoc.context.obj([widgetDictRef]));
    }
  } else {
    firstPage.node.set(PDFName.of('Annots'), pdfDoc.context.obj([widgetDictRef]));
  }

  // Pasang AcroForm pada Catalog
  const existingAcroForm = pdfDoc.catalog.lookup(PDFName.of('AcroForm'));
  if (existingAcroForm) {
    try {
      const formDict = existingAcroForm as any;
      const fields = formDict.lookup(PDFName.of('Fields'));
      if (fields && typeof fields.push === 'function') {
        fields.push(widgetDictRef);
      }
      formDict.set(PDFName.of('SigFlags'), pdfDoc.context.obj(3));
    } catch {
      pdfDoc.catalog.set(
        PDFName.of('AcroForm'),
        pdfDoc.context.obj({
          Fields: [widgetDictRef],
          SigFlags: 3,
        })
      );
    }
  } else {
    pdfDoc.catalog.set(
      PDFName.of('AcroForm'),
      pdfDoc.context.obj({
        Fields: [widgetDictRef],
        SigFlags: 3,
      })
    );
  }

  // 4. Simpan berkas PDF biner awal dengan useObjectStreams: false
  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
  let pdfString = '';
  const len = pdfBytes.length;
  const chunkSize = 32768;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = pdfBytes.subarray(i, Math.min(i + chunkSize, len));
    pdfString += String.fromCharCode.apply(null, Array.from(chunk));
  }

  // 5. Cari offset /Contents dan /ByteRange
  const contentsRegex = /\/Contents\s*<([0-9a-fA-F\s]+)>/;
  const contentsMatch = contentsRegex.exec(pdfString);
  if (!contentsMatch) {
    throw new Error('Gagal menemukan placeholder kamus /Contents dalam struktur PDF');
  }

  const contentsStart = contentsMatch.index + contentsMatch[0].indexOf('<') + 1;
  const contentsEnd = contentsMatch.index + contentsMatch[0].lastIndexOf('>');

  // Rentang byte yang dihitung tanda tangannya:
  // Part 1: dari byte 0 sampai pembuka '<' pada /Contents
  // Part 2: dari penutup '>' pada /Contents sampai akhir berkas
  const range1Start = 0;
  const range1Length = contentsStart - 1; // Termasuk karakter '<'
  const range2Start = contentsEnd + 1; // Termasuk karakter '>'
  const range2Length = pdfBytes.length - range2Start;

  const actualByteRange = `[ ${range1Start} ${range1Length} ${range2Start} ${range2Length} ]`;
  const byteRangeRegex = /\/ByteRange\s*\[\s*0\s+1000000000\s+1000000000\s+1000000000\s*\]/;
  const matchByteRange = byteRangeRegex.exec(pdfString);

  if (!matchByteRange) {
    throw new Error('Gagal menemukan placeholder kamus /ByteRange dalam struktur PDF');
  }

  // Timpa nilai /ByteRange dengan padding spasi yang sama persis agar ukuran byte tidak bergeser
  const paddedByteRange = `/ByteRange ${actualByteRange.padEnd(matchByteRange[0].length - '/ByteRange '.length, ' ')}`;
  pdfString =
    pdfString.slice(0, matchByteRange.index) +
    paddedByteRange +
    pdfString.slice(matchByteRange.index + matchByteRange[0].length);

  // 6. Ekstrak dua segmen data yang dicakup oleh ByteRange
  const part1String = pdfString.slice(range1Start, range1Length);
  const part2String = pdfString.slice(range2Start, range2Start + range2Length);

  // Bangun buffer biner untuk dihitung SHA-256 Digest-nya
  const part1Bytes = new Uint8Array(part1String.length);
  for (let i = 0; i < part1String.length; i++) {
    part1Bytes[i] = part1String.charCodeAt(i) & 0xff;
  }

  const part2Bytes = new Uint8Array(part2String.length);
  for (let i = 0; i < part2String.length; i++) {
    part2Bytes[i] = part2String.charCodeAt(i) & 0xff;
  }

  const combinedBytes = new Uint8Array(part1Bytes.length + part2Bytes.length);
  combinedBytes.set(part1Bytes, 0);
  combinedBytes.set(part2Bytes, part1Bytes.length);

  // 7. Hasilkan Tanda Tangan Detached PKCS#7 menggunakan Certificate Authority Spesifik
  const creds = getOrCreateSigningCredentials(signerProfile, authorityProfile);
  const hexSignature = createDetachedPkcs7Signature(combinedBytes, {
    credentials: creds,
    signingTime,
  });

  // 8. Masukkan nilai heksadesimal tanda tangan ke dalam /Contents dengan padding 0
  if (hexSignature.length > SIGNATURE_HEX_LENGTH) {
    throw new Error(`Ukuran tanda tangan digital (${hexSignature.length}) melebihi alokasi placeholder (${SIGNATURE_HEX_LENGTH})`);
  }

  const paddedHexSignature = hexSignature.padEnd(SIGNATURE_HEX_LENGTH, '0');
  pdfString = pdfString.slice(0, contentsStart) + paddedHexSignature + pdfString.slice(contentsEnd);

  // 9. Konversi kembali string latin1 ke Uint8Array biner murni
  const finalSignedPdf = new Uint8Array(pdfString.length);
  for (let i = 0; i < pdfString.length; i++) {
    finalSignedPdf[i] = pdfString.charCodeAt(i) & 0xff;
  }

  return finalSignedPdf;
}
