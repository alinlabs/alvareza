import React from 'react';

// Subcomponent: Static formatted preview of email body with bold greeting, indented bullet points, and WhatsApp hyperlinks
export const FormattedEmailBodyPreview: React.FC<{ body: string }> = ({ body }) => {
  if (!body) {
    return <p className="text-slate-400 italic text-xs">Belum ada draf isi email.</p>;
  }

  const lines = body.split('\n');

  // Helper to render text with WhatsApp hyperlinks
  const renderTextWithLinks = (text: string) => {
    const phoneRegex = /(\+?62|0)[\s\-]?[0-9]{3,4}[\s\-]?[0-9]{3,5}[\s\-]?[0-9]{3,5}/g;
    if (!phoneRegex.test(text)) {
      return text;
    }

    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    let match: RegExpExecArray | null;
    phoneRegex.lastIndex = 0;
    while ((match = phoneRegex.exec(text)) !== null) {
      const offset = match.index;
      if (offset > lastIdx) {
        parts.push(text.substring(lastIdx, offset));
      }
      const rawPhone = match[0];
      let digits = rawPhone.replace(/\D/g, '');
      if (digits.startsWith('0')) {
        digits = '62' + digits.slice(1);
      } else if (!digits.startsWith('62')) {
        digits = '62' + digits;
      }
      const waUrl = `https://wa.me/${digits}`;
      parts.push(
        <a
          key={offset}
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline font-medium"
        >
          {rawPhone}
        </a>
      );
      lastIdx = offset + rawPhone.length;
    }
    if (lastIdx < text.length) {
      parts.push(text.substring(lastIdx));
    }
    return parts;
  };

  return (
    <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // 1. Baris kosong -> pemisah paragraf
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // 2. Baris salam pembuka (Yth. ..., Dear ...) -> Bold
        const isSalutation =
          /^Yth\./i.test(trimmed) ||
          /^Kepada\s+Yth/i.test(trimmed) ||
          /^Dear\s+/i.test(trimmed) ||
          /^Dengan\s+hormat/i.test(trimmed) ||
          /^Halo\s+/i.test(trimmed);

        if (isSalutation && idx < 5) {
          return (
            <p key={idx} className="font-bold text-slate-900">
              {renderTextWithLinks(line)}
            </p>
          );
        }

        // 3. Poin bullet / daftar berkas lampiran (- atau •) -> Indentasi kiri rapi
        if (/^[\-\•\*\–]\s+/.test(trimmed)) {
          const bulletText = trimmed.replace(/^[\-\•\*\–]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-3 py-0.5">
              <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
              <span className="text-slate-800">{renderTextWithLinks(bulletText)}</span>
            </div>
          );
        }

        // 4. Baris salam penutup / tanda tangan (Hormat saya, Sincerely, Nama) -> Spasi atas & bold
        const isClosing =
          /^Hormat\s+saya/i.test(trimmed) ||
          /^Sincerely/i.test(trimmed) ||
          /^Best\s+regards/i.test(trimmed);

        if (isClosing) {
          return (
            <p key={idx} className="pt-2 font-medium text-slate-800">
              {renderTextWithLinks(line)}
            </p>
          );
        }

        // 5. Paragraf teks biasa
        return (
          <p key={idx} className="text-slate-700">
            {renderTextWithLinks(line)}
          </p>
        );
      })}
    </div>
  );
};
