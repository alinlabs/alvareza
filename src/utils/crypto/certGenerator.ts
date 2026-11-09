/**
 * Digital Profile Alvareza Document Security Engine - Public Key Infrastructure & X.509 Certificate Generator
 * Menggunakan node-forge murni TypeScript untuk menghasilkan sertifikat digital X.509 v3
 * dan tanda tangan terpisah (detached PKCS#7 / CMS) berstandar Adobe PPKLite / PAdES.
 */

import forge from 'node-forge';
import { DIGITAL_SIGNATURE_CONFIG, DigitalSignatureProfile } from '../../config/digitalSignatureConfig';

export interface KeyPairAndCert {
  privateKey: forge.pki.rsa.PrivateKey;
  publicKey: forge.pki.rsa.PublicKey;
  certificate: forge.pki.Certificate;
  certificatePem: string;
}

// Map cache agar pembuatan kunci RSA 2048-bit per otoritas penerbit hanya dilakukan 1 kali selama sesi peramban
const credentialsCacheMap = new Map<string, KeyPairAndCert>();

/**
 * Menghasilkan atau mengembalikan pasangan kunci RSA 2048-bit dan sertifikat X.509 penerbit yang di-cache.
 */
export function getOrCreateSigningCredentials(
  profile: DigitalSignatureProfile = DIGITAL_SIGNATURE_CONFIG.signer,
  authorityProfile: DigitalSignatureProfile = DIGITAL_SIGNATURE_CONFIG.authority
): KeyPairAndCert {
  const cacheKey = `${authorityProfile.commonName}_${authorityProfile.organization}_${profile.commonName}`;
  if (credentialsCacheMap.has(cacheKey)) {
    return credentialsCacheMap.get(cacheKey)!;
  }

  // Generate pasangan kunci RSA 2048-bit
  const keypair = forge.pki.rsa.generateKeyPair(DIGITAL_SIGNATURE_CONFIG.crypto.rsaBits);

  // Buat sertifikat X.509 v3
  const cert = forge.pki.createCertificate();
  cert.publicKey = keypair.publicKey;
  cert.serialNumber = '01' + forge.util.bytesToHex(forge.random.getBytesSync(15));

  const now = new Date();
  cert.validity.notBefore = now;
  const expiry = new Date();
  expiry.setFullYear(now.getFullYear() + profile.validityYears);
  cert.validity.notAfter = expiry;

  // Subject DN (Identitas Penandatangan)
  const subjectAttrs = [
    { name: 'commonName', value: profile.commonName },
    { name: 'countryName', value: profile.country },
    { shortName: 'ST', value: profile.stateOrProvince },
    { name: 'localityName', value: profile.locality },
    { name: 'organizationName', value: profile.organization },
    { shortName: 'OU', value: profile.organizationalUnit },
    { name: 'emailAddress', value: profile.email },
  ];

  // Issuer DN (Otoritas Penerbit / CA)
  const issuerAttrs = [
    { name: 'commonName', value: authorityProfile.commonName },
    { name: 'countryName', value: authorityProfile.country },
    { shortName: 'ST', value: authorityProfile.stateOrProvince },
    { name: 'localityName', value: authorityProfile.locality },
    { name: 'organizationName', value: authorityProfile.organization },
    { shortName: 'OU', value: authorityProfile.organizationalUnit },
    { name: 'emailAddress', value: authorityProfile.email },
  ];

  cert.setSubject(subjectAttrs);
  cert.setIssuer(issuerAttrs);

  // Ekstensi X.509 v3 standar
  cert.setExtensions([
    {
      name: 'basicConstraints',
      cA: false,
    },
    {
      name: 'keyUsage',
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
    },
    {
      name: 'extKeyUsage',
      serverAuth: false,
      clientAuth: true,
      codeSigning: false,
      emailProtection: true,
    },
    {
      name: 'subjectAltName',
      altNames: [
        {
          type: 1, // RFC822 (Email)
          value: profile.email,
        },
      ],
    },
  ]);

  // Tanda tangani sertifikat menggunakan private key
  cert.sign(keypair.privateKey, forge.md.sha256.create());

  const certificatePem = forge.pki.certificateToPem(cert);

  const credEntry: KeyPairAndCert = {
    privateKey: keypair.privateKey,
    publicKey: keypair.publicKey,
    certificate: cert,
    certificatePem,
  };

  credentialsCacheMap.set(cacheKey, credEntry);
  return credEntry;
}

/**
 * Menghasilkan Tanda Tangan Detached PKCS#7 / CMS dalam format DER heksadesimal
 * untuk buffer byte dokumen PDF yang ditunjuk oleh ByteRange.
 */
export function createDetachedPkcs7Signature(
  dataBuffer: Uint8Array | ArrayBuffer | Buffer,
  options?: {
    credentials?: KeyPairAndCert;
    signingTime?: Date;
  }
): string {
  const creds = options?.credentials || getOrCreateSigningCredentials();
  const signingTime = options?.signingTime || new Date();

  // Konversi buffer byte ke buffer node-forge
  let bytesString: string;
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(dataBuffer)) {
    bytesString = dataBuffer.toString('latin1');
  } else {
    const uint8 = new Uint8Array(dataBuffer);
    let binary = '';
    const len = uint8.length;
    const chunkSize = 32768;
    for (let i = 0; i < len; i += chunkSize) {
      const chunk = uint8.subarray(i, Math.min(i + chunkSize, len));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    bytesString = binary;
  }

  const forgeBuffer = forge.util.createBuffer(bytesString, 'raw');

  // Bangun struktur data PKCS#7 SignedData
  const p7 = forge.pkcs7.createSignedData();
  p7.content = forgeBuffer;
  p7.addCertificate(creds.certificate);
  p7.addSigner({
    key: creds.privateKey,
    certificate: creds.certificate,
    digestAlgorithm: forge.pki.oids.sha256,
    authenticatedAttributes: [
      {
        type: forge.pki.oids.contentType,
        value: forge.pki.oids.data,
      },
      {
        type: forge.pki.oids.signingTime,
        value: signingTime as any,
      },
      {
        type: forge.pki.oids.messageDigest,
      },
    ],
  });

  p7.sign({ detached: true });

  const rawDer = forge.asn1.toDer(p7.toAsn1()).getBytes();
  const hexSignature = forge.util.bytesToHex(rawDer);

  return hexSignature;
}
