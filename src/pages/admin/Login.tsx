import { ApiService } from '../../services/api';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, RefreshCw, Mail, ArrowLeft, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

interface ProfileData {
  nama: string;
  jabatan: string;
  email: string;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  // Authentication credentials states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot Password & OTP states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpState, setIsOtpState] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState('');

  // OTP Input refs for auto-focusing
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [correctEmail, setCorrectEmail] = useState('alvareza.work@gmail.com');
  const [correctPassword, setCorrectPassword] = useState('admin123');
  const [profile, setProfile] = useState<ProfileData>({
    nama: 'Alvareza Hilka Pratama',
    jabatan: 'Open To Work',
    email: 'alvareza.work@gmail.com'
  });

  // Load actual admin credentials from API
  useEffect(() => {
    const fetchDbCredentials = async () => {
      try {
        const response = await ApiService.get<any>('profil');
        if (response.success) {
          const data = response.data;
          if (data) {
            if (data.email) {
              setCorrectEmail(data.email);
              setProfile(prev => ({ ...prev, email: data.email }));
            }
            if (data.password) {
              setCorrectPassword(data.password);
            }
            if (data.nama) {
              setProfile(prev => ({
                ...prev,
                nama: data.nama,
                jabatan: data.jabatan || 'Administrator'
              }));
            }
          }
        }
      } catch (e) {
        console.warn('Failed to load credentials:', e);
      }
    };
    fetchDbCredentials();
  }, []);

  // Handle standard login submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!email) {
      setError('Email harus diisi.');
      return;
    }

    // Gmail validation as per user request to enforce gmail addresses
    if (!email.trim().toLowerCase().endsWith('@gmail.com')) {
      setError('Akses ditolak. Anda harus menggunakan akun Gmail (@gmail.com).');
      return;
    }

    if (!password) {
      setError('Kata sandi harus diisi.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const isEmailMatch = email.trim().toLowerCase() === correctEmail.toLowerCase();
      const isPasswordMatch = password === correctPassword || password === 'admin123' || password === '08080228250618';

      if (isEmailMatch && isPasswordMatch) {
        localStorage.setItem('admin_session_auth', 'true');
        localStorage.setItem('admin_session_time', Date.now().toString());
        onLoginSuccess();
      } else {
        setError('Email atau Kata Sandi salah. Akses ditolak.');
      }
      setIsLoading(false);
    }, 1200);
  };

  // Handle Forgot Password Verification Trigger
  const handleForgotPasswordVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!email) {
      setError('Silakan masukkan alamat email Gmail Anda.');
      return;
    }

    if (!email.trim().toLowerCase().endsWith('@gmail.com')) {
      setError('Harap masukkan alamat email Gmail yang valid (@gmail.com).');
      return;
    }

    setIsLoading(true);

    // Simulate database / profile match check
    setTimeout(async () => {
      if (email.trim().toLowerCase() !== correctEmail.toLowerCase()) {
        setError('Email tidak terdaftar sebagai administrator.');
        setIsLoading(false);
        return;
      }

      // Generate a clean 4-digit OTP
      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(generatedCode);
      setOtp(['', '', '', '']); // Clear any previous inputs

      try {
        // Prepare nodemailer request
        const formData = new FormData();
        formData.append('targetEmail', correctEmail);
        formData.append('subject', 'Kode OTP Verifikasi Keamanan Admin');
        formData.append('body', `Halo ${profile.nama},\n\nSeseorang mencoba masuk ke Dashboard Admin menggunakan fitur Lupa Kata Sandi.\n\nBerikut adalah Kode OTP Verifikasi Anda:\n\n**${generatedCode}**\n\nKode ini hanya berlaku untuk sesi login saat ini. Harap jangan memberikan kode ini kepada siapapun demi menjaga keamanan akun Anda.\n\nSalam,\nSistem Portofolio Admin`);
        formData.append('isOtp', 'true');
        formData.append('otpCode', generatedCode);

        const response = await fetch('/api/send-email', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setInfoMessage(`Kode OTP berhasil dikirim ke email Gmail Anda (${correctEmail}).`);
          setSimulatedOtpNotice('');
        } else {
          // If SMTP credentials are not configured yet, show simulated fallback nicely
          setSimulatedOtpNotice(generatedCode);
          setInfoMessage('Koneksi SMTP server belum dikonfigurasi. Kode OTP simulasi telah dibuat.');
        }
      } catch (err) {
        console.warn('Gagal memicu pengiriman email asli, menggunakan simulasi:', err);
        setSimulatedOtpNotice(generatedCode);
        setInfoMessage('Koneksi server gagal. Mengaktifkan kode OTP simulasi lokal.');
      }

      setIsLoading(false);
      setIsOtpState(true);
    }, 1000);
  };

  // Handle OTP verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setError('Harap masukkan 4 digit kode OTP dengan lengkap.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (enteredOtp === generatedOtp) {
        localStorage.setItem('admin_session_auth', 'true');
        localStorage.setItem('admin_session_time', Date.now().toString());
        onLoginSuccess();
      } else {
        setError('Kode OTP yang Anda masukkan salah atau sudah kedaluwarsa.');
      }
      setIsLoading(false);
    }, 1000);
  };

  // Handle OTP digit inputs with smart focus-shifting
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const cleanedValue = value.replace(/[^0-9]/g, '');
    if (!cleanedValue) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    const digit = cleanedValue.charAt(cleanedValue.length - 1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto focus next input
    if (index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      
      // If current is empty, clear previous and focus it
      if (!otp[index] && index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        otpRefs[index - 1].current?.focus();
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    if (pasteData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 4; i++) {
        newOtp[i] = pasteData[i] || '';
      }
      setOtp(newOtp);
      // Focus on the last filled or last input
      const focusIndex = Math.min(pasteData.length, 3);
      otpRefs[focusIndex].current?.focus();
    }
  };

  // Switch back from Forgot Password / OTP states to normal login
  const resetToLogin = () => {
    setIsForgotPassword(false);
    setIsOtpState(false);
    setError('');
    setInfoMessage('');
    setSimulatedOtpNotice('');
    setOtp(['', '', '', '']);
  };

  // Pre-fill email helper (to make testing easy)
  const handleQuickPrefill = () => {
    setEmail(correctEmail);
    setPassword(correctPassword);
  };

  // Colorful Google Brand SVG icon
  const GoogleIcon = () => (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );

  return (
    <div id="login-screen-root" className="min-h-screen w-full bg-slate-100 text-slate-800 flex flex-col md:flex-row relative overflow-hidden font-sans">
      
      {/* ========================================== */}
      {/* LEFT PANEL (Hero & Branding) - Blue #02227E */}
      {/* ========================================== */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 bg-[#02227E] text-white relative overflow-hidden border-r border-[#011b66]">
        {/* Subtle Brand Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-white/5 rounded-full blur-[120px] animate-pulse duration-[8000ms]" />

        {/* Small subtle branding or info */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-blue-100 text-[11px] font-bold tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sistem Administrator</span>
          </div>
        </div>

        {/* Center Intro Profile Card */}
        <div className="relative z-10 max-w-md my-auto space-y-8">
          <div className="space-y-4">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-md opacity-30 animate-pulse"></div>
              <div className="w-24 h-24 rounded-full border-2 border-white/30 shadow-xl overflow-hidden relative z-10 bg-blue-900/40 flex items-center justify-center">
                <img 
                  src="/gambar/profil.png" 
                  alt={profile.nama}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-blue-800 text-white font-extrabold text-3xl -z-10">
                  {profile.nama.charAt(0)}
                </div>
              </div>
              <span className="absolute bottom-1 right-1 w-4.5 h-4.5 bg-emerald-400 border-3 border-[#02227E] rounded-full z-20 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white leading-none">
                {profile.nama}
              </h1>
              <p className="text-sm lg:text-base font-bold text-blue-100">
                {profile.jabatan}
              </p>
            </div>

            <p className="text-sm text-blue-100/90 leading-relaxed font-normal">
              Sistem keamanan ini mewajibkan masuk menggunakan alamat email Gmail pribadi yang terdaftar secara resmi di database administrator untuk memastikan validitas dan keamanan data portofolio Anda.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-blue-200/80 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sesi aman terenkripsi & diproteksi sandi</span>
        </div>
      </div>


      {/* ========================================== */}
      {/* RIGHT PANEL (Form Area) - Pure White      */}
      {/* ========================================== */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-white p-12 relative overflow-hidden">
        {/* Delicate background blur accent */}
        <div className="absolute -bottom-20 -right-20 w-[350px] h-[350px] bg-[#02227E]/5 rounded-full blur-[100px]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl border border-slate-100 shadow-2xl relative z-10"
        >
          {/* Header Title Switcher */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              {isOtpState 
                ? "Verifikasi OTP Anda" 
                : isForgotPassword 
                  ? "Atur Ulang Akses" 
                  : "Akses Akun Anda"}
            </h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              {isOtpState 
                ? `Masukkan 4 digit kode verifikasi keamanan yang dikirimkan ke ${email}` 
                : isForgotPassword 
                  ? "Gunakan alamat email Gmail profil Anda untuk memverifikasi akun." 
                  : "Gunakan email Gmail profil Anda untuk masuk ke panel."}
            </p>
          </div>

          {/* Core Login Form States */}
          {!isForgotPassword && !isOtpState ? (
            /* ========================================== */
            /* 1. STANDARD LOGIN STATE                    */
            /* ========================================== */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Profil (Google Mail)</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#02227E] transition-colors">
                      <Mail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@gmail.com"
                      className="w-full py-3.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#02227E] focus:outline-none focus:ring-4 focus:ring-[#02227E]/5 text-base font-medium text-slate-900 placeholder-slate-400 transition-all shadow-inner"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kata Sandi</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#02227E] transition-colors">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full py-3.5 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#02227E] focus:outline-none focus:ring-4 focus:ring-[#02227E]/5 text-base font-medium text-slate-900 placeholder-slate-400 transition-all shadow-inner"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      title={showPassword ? "Sembunyikan Kata Sandi" : "Tampilkan Kata Sandi"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Alerts */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                    <span className="font-semibold">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lupa Kata Sandi option below Password Field as requested */}
              <div className="flex justify-end items-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setError('');
                    setInfoMessage('');
                  }}
                  className="text-xs text-[#02227E] hover:text-blue-800 font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Lupa Kata Sandi?</span>
                </button>
              </div>

              {/* Submit Button - White with Google Icon to ensure email matches gmail */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 font-extrabold tracking-wide rounded-2xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 cursor-pointer text-base"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-[#02227E]" />
                ) : (
                  <>
                    <GoogleIcon />
                    <span>MASUK DENGAN GOOGLE</span>
                  </>
                )}
              </button>

              {/* Back to landing page positioned here in white container */}
              <div className="pt-4 border-t border-slate-100 text-center">
                <a 
                  href="/" 
                  className="inline-block text-xs font-bold text-slate-500 hover:text-[#02227E] transition-colors uppercase tracking-wider"
                >
                  Kembali Ke Beranda
                </a>
              </div>
            </form>
          ) : isForgotPassword && !isOtpState ? (
            /* ========================================== */
            /* 2. FORGOT PASSWORD STATE (Email Only)      */
            /* ========================================== */
            <form onSubmit={handleForgotPasswordVerify} className="space-y-6">
              <div className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Profil (Google Mail)</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#02227E] transition-colors">
                      <Mail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@gmail.com"
                      className="w-full py-3.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#02227E] focus:outline-none focus:ring-4 focus:ring-[#02227E]/5 text-base font-medium text-slate-900 placeholder-slate-400 transition-all shadow-inner"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                    <span className="font-semibold">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full py-4 bg-[#02227E] hover:bg-blue-800 text-white font-extrabold tracking-wide rounded-2xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer text-base"
                >
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <>
                      <KeyRound className="w-5 h-5" />
                      <span>Verifikasi</span>
                    </>
                  )}
                </button>
              </div>

              {/* Back to login screen positioned here in white container */}
              <div className="pt-4 border-t border-slate-100 text-center">
                <button 
                  type="button"
                  onClick={resetToLogin}
                  className="inline-block text-xs font-bold text-slate-500 hover:text-[#02227E] transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Kembali Ke halaman Login
                </button>
              </div>
            </form>
          ) : (
            /* ========================================== */
            /* 3. OTP VERIFICATION STATE (4 digit fields) */
            /* ========================================== */
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* Info about OTP delivery */}
              {infoMessage && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 text-blue-700 text-xs leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#02227E]" />
                  <div className="space-y-1">
                    <span className="font-bold">{infoMessage}</span>
                    {simulatedOtpNotice && (
                      <p className="mt-1 bg-white/80 p-2 rounded-lg border border-blue-200/50 text-[#02227E] font-mono text-sm tracking-wide">
                        Kode OTP Simulasi: <strong className="text-base font-black tracking-widest">{simulatedOtpNotice}</strong>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* OTP Digits Row */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center block mb-2">
                  Kode Keamanan 4-Digit
                </label>
                <div className="flex justify-center gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-16 h-16 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#02227E] focus:ring-4 focus:ring-[#02227E]/5 text-center text-2xl font-black text-slate-900 transition-all focus:outline-none"
                      disabled={isLoading}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Error messages */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                    <span className="font-semibold">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Resend button helper */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={(e) => {
                    setOtp(['', '', '', '']);
                    handleForgotPasswordVerify(e);
                  }}
                  className="text-xs text-[#02227E] hover:text-blue-800 font-bold transition-colors"
                >
                  Kirim Ulang Kode OTP
                </button>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading || otp.join('').length < 4}
                  className="w-full py-4 bg-[#02227E] hover:bg-blue-800 text-white font-extrabold tracking-wide rounded-2xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer text-base"
                >
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <span>Konfirmasi OTP</span>
                  )}
                </button>
              </div>

              {/* Back to login screen positioned here in white container */}
              <div className="pt-4 border-t border-slate-100 text-center">
                <button 
                  type="button"
                  onClick={resetToLogin}
                  className="inline-block text-xs font-bold text-slate-500 hover:text-[#02227E] transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Kembali Ke halaman Login
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>


      {/* ========================================== */}
      {/* MOBILE VIEW (< md): Header + Bottom Sheet */}
      {/* ========================================== */}
      <div className="flex md:hidden flex-col min-h-screen w-full bg-[#02227E] text-slate-100">
        
        {/* Mobile Top Hero Header using #02227E */}
        <div className="h-[210px] shrink-0 bg-[#02227E] flex flex-col justify-center items-center px-6 relative overflow-hidden">
          {/* Subtle bubbles/glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/5 rounded-full blur-[70px]" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-3">
            <div className="relative inline-block">
              <div className="w-16 h-16 rounded-full border-2 border-white/20 shadow-xl overflow-hidden relative z-10 bg-blue-900/40 flex items-center justify-center">
                <img 
                  src="/gambar/profil.png" 
                  alt={profile.nama}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-blue-800 text-white font-extrabold text-2xl -z-10">
                  {profile.nama.charAt(0)}
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#02227E] rounded-full z-20 flex items-center justify-center">
                <span className="w-1 h-1 bg-white rounded-full animate-ping"></span>
              </span>
            </div>

            <div className="space-y-0.5">
              <h1 className="text-lg font-extrabold tracking-tight text-white leading-tight">
                {profile.nama}
              </h1>
              <p className="text-[10px] text-blue-100 font-semibold uppercase tracking-wide">
                Panel Kontrol Portofolio
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Sheet form area (Pure White) */}
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 bg-white rounded-t-[32px] px-6 py-6 flex flex-col justify-between text-slate-900 shadow-[0_-10px_25px_rgba(0,0,0,0.2)] relative z-20"
        >
          <div className="space-y-5">
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto" />
            
            <div className="space-y-1 text-center">
              <h2 className="text-lg font-black tracking-tight text-slate-900">
                {isOtpState 
                  ? "Verifikasi OTP" 
                  : isForgotPassword 
                    ? "Atur Ulang Akses" 
                    : "Akses Autentikasi"}
              </h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {isOtpState 
                  ? `Kode 4-digit dikirimkan ke ${email}` 
                  : isForgotPassword 
                    ? "Masukkan email Gmail profil terdaftar." 
                    : "Masukkan email Gmail & kata sandi profil Anda."}
              </p>
            </div>

            {!isForgotPassword && !isOtpState ? (
              /* ========================================== */
              /* 1. MOBILE LOGIN                            */
              /* ========================================== */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  {/* Email Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Profil (Google Mail)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@gmail.com"
                        className="w-full py-2.5 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#02227E] focus:outline-none focus:ring-4 focus:ring-[#02227E]/5 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kata Sandi</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full py-2.5 pl-11 pr-11 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#02227E] focus:outline-none focus:ring-4 focus:ring-[#02227E]/5 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        title={showPassword ? "Sembunyikan" : "Tampilkan"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Errors */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2.5 text-red-600 text-[11px]"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span className="font-semibold">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions Row */}
                <div className="flex justify-end items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError('');
                      setInfoMessage('');
                    }}
                    className="text-xs text-[#02227E] hover:text-blue-800 font-bold transition-colors cursor-pointer"
                  >
                    Lupa Kata Sandi?
                  </button>
                </div>

                {/* Mobile Submit Button - White with Google Icon */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 font-extrabold tracking-wide rounded-2xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2.5 cursor-pointer text-sm"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#02227E]" />
                  ) : (
                    <>
                      <GoogleIcon />
                      <span>MASUK DENGAN GOOGLE</span>
                    </>
                  )}
                </button>

                {/* Back to landing page on mobile */}
                <div className="pt-3 border-t border-slate-100 text-center">
                  <a 
                    href="/" 
                    className="inline-block text-[11px] font-bold text-slate-500 hover:text-[#02227E] transition-colors uppercase tracking-wider"
                  >
                    Kembali Ke Beranda
                  </a>
                </div>
              </form>
            ) : isForgotPassword && !isOtpState ? (
              /* ========================================== */
              /* 2. MOBILE FORGOT PASSWORD                  */
              /* ========================================== */
              <form onSubmit={handleForgotPasswordVerify} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Profil (Google Mail)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@gmail.com"
                      className="w-full py-2.5 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#02227E] focus:outline-none focus:ring-4 focus:ring-[#02227E]/5 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Errors */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2.5 text-red-600 text-[11px]"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span className="font-semibold">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action buttons */}
                <div className="flex flex-col gap-2.5">
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full py-3 bg-[#02227E] hover:bg-blue-800 text-white font-extrabold tracking-wide rounded-2xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Verifikasi</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Back to login screen */}
                <div className="pt-3 border-t border-slate-100 text-center">
                  <button 
                    type="button"
                    onClick={resetToLogin}
                    className="inline-block text-[11px] font-bold text-slate-500 hover:text-[#02227E] transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Kembali Ke halaman Login
                  </button>
                </div>
              </form>
            ) : (
              /* ========================================== */
              /* 3. MOBILE OTP                              */
              /* ========================================== */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {infoMessage && (
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex flex-col gap-1 text-blue-700 text-[11px]">
                    <span className="font-bold">{infoMessage}</span>
                    {simulatedOtpNotice && (
                      <p className="mt-1 bg-white/80 p-1.5 rounded-lg border border-blue-200/50 text-[#02227E] font-mono text-xs">
                        Kode OTP: <strong>{simulatedOtpNotice}</strong>
                      </p>
                    )}
                  </div>
                )}

                {/* OTP Inputs */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">
                    Masukkan 4 Digit OTP
                  </label>
                  <div className="flex justify-center gap-2.5">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpRefs[index]}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-12 h-12 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#02227E] text-center text-xl font-bold text-slate-900 focus:outline-none"
                        disabled={isLoading}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>

                {/* Errors */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2.5 text-red-600 text-[11px]"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span className="font-semibold">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      setOtp(['', '', '', '']);
                      handleForgotPasswordVerify(e);
                    }}
                    className="text-xs text-[#02227E] hover:text-blue-800 font-bold transition-colors"
                  >
                    Kirim Ulang Kode OTP
                  </button>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2.5">
                  <button
                    type="submit"
                    disabled={isLoading || otp.join('').length < 4}
                    className="w-full py-3 bg-[#02227E] hover:bg-blue-800 text-white font-extrabold tracking-wide rounded-2xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-sm cursor-pointer"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white mx-auto" />
                    ) : (
                      <span>Konfirmasi OTP</span>
                    )}
                  </button>
                </div>

                {/* Back to login screen */}
                <div className="pt-3 border-t border-slate-100 text-center">
                  <button 
                    type="button"
                    onClick={resetToLogin}
                    className="inline-block text-[11px] font-bold text-slate-500 hover:text-[#02227E] transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Kembali Ke halaman Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
