import React from 'react';
import { Trash2 } from 'lucide-react';
import { CustomAttachmentItem } from '../../types';

export interface CustomFilesSectionProps {
  customAttachments: CustomAttachmentItem[];
  handleRemoveCustomAttachment: (id: string) => void;
  processUploadedFiles: (files: FileList | File[], forCertId?: string | null) => Promise<void>;
  setTargetCertIdForPick: (id: string | null) => void;
  attachmentInputRef: React.RefObject<HTMLInputElement | null>;
  isAttachmentDropOver: boolean;
  setIsAttachmentDropOver: (over: boolean) => void;
  formatFileSize: (bytes: number) => string;
}

export const CustomFilesSection: React.FC<CustomFilesSectionProps> = ({
  customAttachments,
  handleRemoveCustomAttachment,
  processUploadedFiles,
  setTargetCertIdForPick,
  attachmentInputRef,
  isAttachmentDropOver,
  setIsAttachmentDropOver,
  formatFileSize,
}) => {
  return (
    <div className="pt-2 border-t border-slate-200/80">
      <div className="flex items-center justify-between mb-1.5">
        <h4 className="text-xs font-bold text-slate-900">
          Lampiran Tambahan
        </h4>
        <button
          type="button"
          onClick={() => {
            setTargetCertIdForPick(null);
            if (attachmentInputRef.current) {
              attachmentInputRef.current.value = '';
              attachmentInputRef.current.click();
            }
          }}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          Tambah Berkas
        </button>
      </div>

      {/* General Extra Attachments List or Empty Dropzone */}
      {customAttachments.filter((a) => !a.certId).length === 0 ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsAttachmentDropOver(true);
          }}
          onDragLeave={() => setIsAttachmentDropOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsAttachmentDropOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              processUploadedFiles(e.dataTransfer.files, null);
            }
          }}
          onClick={() => {
            setTargetCertIdForPick(null);
            if (attachmentInputRef.current) {
              attachmentInputRef.current.value = '';
              attachmentInputRef.current.click();
            }
          }}
          className={`border-2 border-dashed rounded-xl p-2.5 text-center cursor-pointer transition-all ${
            isAttachmentDropOver
              ? 'border-blue-500 bg-blue-50/70'
              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
          }`}
        >
          <p className="text-xs font-medium text-slate-600">
            Sisipkan File Tambahan
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            PDF, DOCX, JPG, PNG, ZIP (Maks. 15MB)
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {customAttachments
            .filter((a) => !a.certId)
            .map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between gap-3 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-2xs"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-800 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomAttachment(file.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer shrink-0"
                  title="Hapus lampiran ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
