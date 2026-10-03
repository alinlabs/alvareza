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
      parts.push(
        <a
          key={`phone-${offset}`}
          href={`https://wa.me/${digits}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer inline-flex items-center gap-0.5"
          title="Buka WhatsApp"
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
    <div className="space-y-2 whitespace-normal font-sans text-xs sm:text-sm text-slate-800 leading-relaxed select-text">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={index} className="h-2" />;
        }

        const isGreeting = /^\s*(Yth\.|Dear\b)/i.test(trimmed);

        // Check if line is a bullet item (•, -, *, or numbered)
        const bulletMatch = trimmed.match(/^([•\-\*]|\d+\.)\s+(.+)$/);
        if (bulletMatch) {
          const bulletSymbol = bulletMatch[1];
          const bulletContent = bulletMatch[2];
          return (
            <div
              key={index}
              className="pl-4 sm:pl-6 -my-0.5 flex items-start gap-2.5 text-slate-800"
            >
              <span className="text-slate-700 font-bold select-none shrink-0 mt-0.5">
                {bulletSymbol.length === 1 ? '•' : bulletSymbol}
              </span>
              <span className="flex-1 leading-relaxed">
                {renderTextWithLinks(bulletContent)}
              </span>
            </div>
          );
        }

        if (isGreeting) {
          return (
            <div key={index} className="font-bold text-slate-900 pb-0.5">
              {renderTextWithLinks(trimmed)}
            </div>
          );
        }

        return (
          <div key={index} className="leading-relaxed">
            {renderTextWithLinks(trimmed)}
          </div>
        );
      })}
    </div>
  );
};
