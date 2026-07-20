import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:alvareza.work@gmail.com?subject=${encodeURIComponent(formData.subject || 'Pesan dari Website')}&body=${encodeURIComponent(`Nama: ${formData.name}\nEmail: ${formData.email}\n\nPesan:\n${formData.message}`)}`;
    window.location.href = mailtoLink;
  };

  return (
    <section id="contact" className="py-4 md:py-5 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8 text-left"
        >
          <h2 className="text-[20px] md:text-[25px] lg:text-[30px] font-extrabold text-slate-950 dark:text-slate-50 mb-2 md:mb-4 flex items-center justify-start gap-2">
            <MessageSquare className="text-accent w-6 h-6 shrink-0" />
            <span>Mulai Percakapan</span>
          </h2>
        </motion.div>

        <form className="space-y-6 w-full" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap</label>
              <input 
                type="text" 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 focus:bg-white dark:bg-slate-950 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input 
                type="email" 
                id="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 focus:bg-white dark:bg-slate-950 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subjek</label>
            <input 
              type="text" 
              id="subject" 
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 focus:bg-white dark:bg-slate-950 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
              placeholder="Peluang Kolaborasi"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pesan</label>
            <textarea 
              id="message" 
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 focus:bg-white dark:bg-slate-950 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
              placeholder="Tulis pesan Anda di sini..."
              required
            ></textarea>
          </div>
          <div className="flex justify-center md:justify-end">
            <button 
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 focus:ring-4 focus:ring-accent/20 transition-all shadow-md hover:shadow-lg"
            >
              <Send size={18} />
              Kirim Pesan
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
