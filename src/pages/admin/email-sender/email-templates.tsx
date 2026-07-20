import React, { useEffect, useState } from 'react';
import { ApiService } from '../../../services/api';
import { Mail, Edit2, Loader2, Save, X, Eye } from 'lucide-react';

interface EmailTemplate {
  id: string;
  jenis: string;
  html: string;
}

const customScrollbarStyle = `
<style>
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(203, 213, 225, 0.4);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.6);
  }
  body {
    scrollbar-width: thin;
    scrollbar-color: rgba(203, 213, 225, 0.4) transparent;
  }
</style>
`;

const injectScrollbarStyle = (html?: string) => {
  if (!html) return '';
  if (html.includes('</head>')) {
    return html.replace('</head>', `${customScrollbarStyle}</head>`);
  }
  return customScrollbarStyle + html;
};

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<EmailTemplate | null>(null);
  const [editedHtml, setEditedHtml] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.get<EmailTemplate[]>('email-template');
      if (response.success && response.data) {
        setTemplates(response.data);
      } else {
        setError(response.message || 'Gagal memuat template');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat template');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleEditClick = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setEditedHtml(template.html);
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setEditedHtml('');
  };

  const handleSave = async () => {
    if (!editingTemplate) return;
    
    setSaving(true);
    try {
      const updatedTemplate = { ...editingTemplate, html: editedHtml };
      const response = await ApiService.put<any>('email-template', updatedTemplate);
      
      if (response.success) {
        setTemplates((templates || []).map(t => t.id === editingTemplate.id ? updatedTemplate : t));
        setEditingTemplate(null);
      } else {
        alert('Gagal menyimpan template: ' + response.message);
      }
    } catch (err: any) {
      alert('Terjadi kesalahan saat menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && (templates || []).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-accent mb-4" />
        <p className="text-sm font-medium">Memuat template email...</p>
      </div>
    );
  }

  if (viewingTemplate || editingTemplate) {
    const activeTemplate = viewingTemplate || editingTemplate;
    const isEditing = !!editingTemplate;

    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 md:p-6 flex flex-col h-[calc(100vh-220px)] md:h-[calc(100vh-160px)] min-h-[400px]">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {activeTemplate?.jenis}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="p-2 rounded-lg bg-accent hover:bg-accent/90 text-white transition-colors disabled:opacity-50"
                title="Simpan"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={() => {
                if (!isEditing && activeTemplate) {
                  handleEditClick(activeTemplate);
                  setViewingTemplate(null);
                }
              }}
              className={`p-2 rounded-lg border transition-colors ${isEditing ? 'bg-accent/10 border-accent/20 text-accent' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              title="Edit Template"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => {
                if (isEditing) {
                  handleCancelEdit();
                  setViewingTemplate(activeTemplate);
                }
              }}
              className={`p-2 rounded-lg border transition-colors ${!isEditing ? 'bg-accent/10 border-accent/20 text-accent' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              title="Lihat Template"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (isEditing) {
                  handleCancelEdit();
                } else {
                  setViewingTemplate(null);
                }
              }}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex-1 flex flex-col min-h-0">
            <textarea
              value={editedHtml}
              onChange={(e) => setEditedHtml(e.target.value)}
              className="flex-1 w-full p-4 text-sm font-mono bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none overflow-y-auto"
              placeholder="<html>...</html>"
            />
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 min-h-0">
            <iframe
              srcDoc={injectScrollbarStyle(activeTemplate?.html)}
              title={activeTemplate?.jenis}
              className="w-full h-full border-0"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(templates || []).map(template => (
          <div 
            key={template.id}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{template.jenis}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewingTemplate(template)}
                  className="p-2 bg-slate-50 hover:bg-accent/10 text-slate-400 hover:text-accent rounded-lg transition-colors"
                  title="Lihat Template"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditClick(template)}
                  className="p-2 bg-slate-50 hover:bg-accent/10 text-slate-400 hover:text-accent rounded-lg transition-colors"
                  title="Edit Template"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-[500px] relative shadow-inner">
              <iframe
                srcDoc={injectScrollbarStyle(template.html)}
                title={template.jenis}
                className="w-full h-full border-0 bg-white"
                tabIndex={-1}
              />
            </div>
          </div>
        ))}
        {(templates || []).length === 0 && !loading && !error && (
          <div className="col-span-full text-center py-12 text-slate-500 text-sm">
            Tidak ada template email ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
