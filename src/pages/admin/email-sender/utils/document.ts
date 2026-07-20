import { PDFDocument } from 'pdf-lib';

export interface AttachmentItem {
  blob: Blob;
  filename: string;
}

/**
 * Merges multiple PDF files into a single PDF document.
 * Operates on list of { blob, filename } items.
 */
export async function mergePdfDocuments(
  gatheredAttachments: AttachmentItem[],
  signal?: AbortSignal
): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  
  for (const item of gatheredAttachments) {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }
    
    const isPdf = item.blob.type === 'application/pdf' || item.filename.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      const arrayBuffer = await item.blob.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }
  }
  
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }
  
  const mergedPdfBytes = await mergedPdf.save();
  return new Blob([mergedPdfBytes], { type: 'application/pdf' });
}

/**
 * Builds email FormData containing all parameters and attachments
 */
export function buildEmailFormData(
  fields: {
    targetEmail: string;
    subject: string;
    body: string;
    bodyFontFamily: string;
    emailFormat: string;
    paragraphAlign: string;
    location: string;
  },
  attachments: AttachmentItem[]
): FormData {
  const formData = new FormData();
  formData.append('targetEmail', fields.targetEmail);
  formData.append('subject', fields.subject);
  formData.append('body', fields.body);
  formData.append('bodyFontFamily', fields.bodyFontFamily);
  formData.append('emailFormat', fields.emailFormat);
  formData.append('paragraphAlign', fields.paragraphAlign);
  formData.append('location', fields.location);
  
  for (const attachment of attachments) {
    formData.append('attachments', attachment.blob, attachment.filename);
  }
  
  return formData;
}
