import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        setMousePos({ x, y });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div 
            className="relative flex min-h-screen font-body bg-[#F4F7FA] overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            <Head title="Log in - Pustaka Digital" />

            {/* Custom Styles & Animasi Terpusat */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
                    
                    .font-heading { font-family: 'Outfit', sans-serif; }
                    .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }

                    /* Entrance Animations */
                    @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
                    .animate-fade-in-left { opacity: 0; animation: fadeInLeft 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

                    @keyframes slideUpFade { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                    .animate-slide-up-fade { opacity: 0; animation: slideUpFade 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s forwards; }
                    .animate-btn-delay { opacity: 0; animation: slideUpFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 1.2s forwards; }

                    /* Background Animasi Gradient Bergerak */
                    @keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                    .bg-animated-gradient {
                        background: linear-gradient(-45deg, #0c2a47, #10375C, #184b7a, #0c2a47);
                        background-size: 400% 400%;
                        animation: gradientMove 15s ease infinite;
                    }

                    /* Grid Pattern Transparan */
                    .bg-grid-pattern {
                        background-image: 
                            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
                        background-size: 40px 40px;
                    }

                    /* Floating Animations CSS */
                    @keyframes float1 { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(2deg); } }
                    @keyframes float2 { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(15px) rotate(-2deg); } }
                    @keyframes float3 { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-10px) scale(1.05); } }
                    
                    .animate-float-1 { animation: float1 6s ease-in-out infinite; }
                    .animate-float-2 { animation: float2 7s ease-in-out infinite reverse; }
                    .animate-float-3 { animation: float3 5s ease-in-out infinite; }

                    /* Efek Shimmer Emas */
                    @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
                    @keyframes slowGlow { 0%, 100% { filter: drop-shadow(0 0 8px rgba(229,184,11,0.3)); } 50% { filter: drop-shadow(0 0 20px rgba(229,184,11,0.8)); } }
                    .text-shimmer-glow {
                        background: linear-gradient(90deg, #E5B80B 0%, #FFF8D6 40%, #E5B80B 80%);
                        background-size: 200% auto;
                        color: transparent;
                        -webkit-background-clip: text;
                        background-clip: text;
                        animation: shimmer 3s linear infinite, slowGlow 4s ease-in-out infinite;
                    }

                    /* Partikel Debu Digital */
                    @keyframes particleFloat { 0% { transform: translateY(0) translateX(0); opacity: 0; } 50% { opacity: 0.8; } 100% { transform: translateY(-100px) translateX(20px); opacity: 0; } }
                    .particle { animation: particleFloat 4s infinite linear; }

                    /* Tombol Kilau (Shine) */
                    @keyframes buttonShine { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }
                    .animate-button-shine { animation: buttonShine 3s infinite; }
                `}
            </style>

            {/* === TOMBOL KEMBALI POJOK KIRI ATAS === */}
            <Link 
                href="/" 
                className="absolute top-6 left-6 md:top-8 md:left-10 flex items-center px-4 py-2 text-sm font-semibold text-gray-600 md:text-white/90 bg-white/60 md:bg-white/10 backdrop-blur-md border border-white/80 md:border-white/20 rounded-full shadow-lg hover:bg-white hover:text-[#10375C] hover:-translate-x-1 transition-all duration-300 group z-[60]"
            >
                <div className="flex items-center justify-center w-7 h-7 mr-2 rounded-full bg-gray-200/50 md:bg-white/20 group-hover:bg-[#10375C]/10 transition-colors duration-300">
                    <svg 
                        className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </div>
                <span>Beranda</span>
            </Link>

            {/* BAGIAN KIRI - VISUAL & ANIMASI PARALLAX */}
            <div className="relative hidden md:flex md:w-1/2 bg-animated-gradient items-center justify-center overflow-hidden z-10">
                
                {/* Layer Belakang (Grid & Glow) */}
                <div 
                    className="absolute inset-0 transition-transform duration-700 ease-out pointer-events-none scale-110"
                    style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }}
                >
                    <div className="absolute inset-0 bg-grid-pattern"></div>
                    <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[35rem] h-[35rem] bg-[#E5B80B]/10 rounded-full blur-[100px]"></div>
                </div>

                {/* Layer Tengah (Orbit & Partikel) */}
                <div 
                    className="absolute inset-0 transition-transform duration-700 ease-out pointer-events-none scale-110"
                    style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25rem] h-[25rem] border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>

                    <div className="absolute top-[20%] left-[30%] w-1 h-1 bg-blue-200 rounded-full particle" style={{animationDuration: '5s', animationDelay: '0s'}}></div>
                    <div className="absolute top-[60%] left-[20%] w-1.5 h-1.5 bg-yellow-200 rounded-full particle" style={{animationDuration: '7s', animationDelay: '1s'}}></div>
                    <div className="absolute top-[40%] right-[30%] w-1 h-1 bg-white rounded-full particle" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
                    <div className="absolute bottom-[30%] left-[40%] w-2 h-2 bg-blue-300/50 rounded-full particle" style={{animationDuration: '8s', animationDelay: '0.5s'}}></div>
                </div>

                {/* Layer Ikon Kaca Melayang */}
                <div 
                    className="absolute inset-0 transition-transform duration-700 ease-out pointer-events-none"
                    style={{ transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)` }}
                >
                    <div className="absolute top-[25%] left-[20%] w-14 h-14 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center shadow-lg animate-float-1 z-10">
                        <svg className="w-6 h-6 text-blue-200/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <div className="absolute top-[30%] right-[15%] w-20 h-24 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] animate-float-2 z-10">
                        <div className="w-16 h-20 border border-white/20 rounded-lg flex flex-col items-center justify-center p-2 bg-gradient-to-br from-white/10 to-transparent">
                            <div className="w-8 h-1 bg-white/20 rounded-full mb-2"></div>
                            <div className="w-full h-full bg-blue-400/20 rounded border border-blue-300/30"></div>
                        </div>
                    </div>
                    <div className="absolute bottom-[35%] left-[15%] w-20 h-20 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex flex-col items-center justify-center shadow-xl animate-float-3 z-10 rotate-12">
                        <svg className="w-8 h-8 text-yellow-500/80 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        <div className="w-8 h-1 bg-white/20 rounded-full"></div>
                    </div>
                    <div className="absolute bottom-[25%] right-[20%] w-16 h-16 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center shadow-xl animate-float-1 z-10 delay-75 -rotate-6">
                        <svg className="w-8 h-8 text-blue-100/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                    </div>
                </div>

                {/* Konten Teks (Bergerak Halus) */}
                <div 
                    className="relative z-20 transition-transform duration-700 ease-out pr-12" 
                    style={{ transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)` }}
                >
                    <div className="flex flex-col items-center justify-center px-12 text-center bg-black/5 backdrop-blur-sm p-10 rounded-3xl border border-white/5 shadow-2xl animate-fade-in-left">
                        <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-white mb-2 tracking-wide">
                            PUSTAKA <span className="text-shimmer-glow">DIGITAL</span>
                        </h1>
                        <div className="w-16 h-[2px] bg-[#E5B80B]/80 mt-4 mb-6 rounded-full"></div>
                        <p className="text-sm lg:text-base text-blue-100/80 font-light tracking-wide max-w-sm">
                            Portal akses literatur dan sumber daya informasi terpadu.
                        </p>
                        <div className="mt-8 pt-6 border-t border-white/10 w-full">
                            <p className="text-sm font-light italic text-white/60 tracking-wide">
                                "Jadilah lebih cerdas dengan satu buku setiap hari."
                            </p>
                        </div>
                    </div>
                </div>

                {/* ========================================= */}
                {/* 🌟 REFINED ASYMMETRICAL S-CURVE & GLOW 🌟 */}
                {/* ========================================= */}
                <div className="absolute top-0 bottom-0 right-0 w-16 md:w-[80px] z-50 hidden md:block text-[#F4F7FA] pointer-events-none">
                    <svg 
                        className="w-full h-full drop-shadow-[-2px_0_4px_rgba(255,255,255,0.4)] drop-shadow-[-12px_0_20px_rgba(12,42,71,0.5)]" 
                        preserveAspectRatio="none" 
                        viewBox="0 0 100 100" 
                        fill="currentColor"
                    >
                        {/* Definisi Glow Putih Transparan */}
                        <defs>
                            <linearGradient id="edgeGlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                                <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
                                <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                            </linearGradient>
                        </defs>
                        {/* Path Asimetris yang Natural */}
                        <path 
                            d="M100 0 L100 100 L20 100 C 70 75, 10 25, 40 0 Z" 
                            stroke="url(#edgeGlow)" 
                            strokeWidth="2" 
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                </div>
            </div>

            {/* BAGIAN KANAN - FORM LOGIN */}
            <div className="relative flex w-full md:w-1/2 items-center justify-center p-6 sm:p-12 z-20 bg-[#F4F7FA]">
                <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/50 p-8 sm:p-10 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] animate-slide-up-fade relative z-10 mt-8 md:mt-0">
                    <div className="mb-10 text-center sm:text-left">
                        <h2 className="text-3xl font-heading font-bold text-[#10375C]">Selamat Datang</h2>
                        <p className="text-gray-500 mt-2 text-sm font-light">Masuk ke akun Anda untuk melanjutkan.</p>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div className="relative group">
                            <InputLabel 
                                htmlFor="email" 
                                value="Email" 
                                className="text-gray-600 font-medium mb-1.5 block transition-transform duration-300 origin-left transform group-focus-within:-translate-y-1 group-focus-within:text-[#10375C]" 
                            />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full bg-white/60 backdrop-blur-sm border-gray-200 rounded-xl shadow-sm transition-all duration-300 focus:border-[#10375C] focus:ring-[4px] focus:ring-[#10375C]/15 hover:border-[#10375C]/50 hover:shadow-[0_0_15px_rgba(16,55,92,0.08)]"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="relative group">
                            <InputLabel 
                                htmlFor="password" 
                                value="Password" 
                                className="text-gray-600 font-medium mb-1.5 block transition-transform duration-300 origin-left transform group-focus-within:-translate-y-1 group-focus-within:text-[#10375C]" 
                            />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full bg-white/60 backdrop-blur-sm border-gray-200 rounded-xl shadow-sm transition-all duration-300 focus:border-[#10375C] focus:ring-[4px] focus:ring-[#10375C]/15 hover:border-[#10375C]/50 hover:shadow-[0_0_15px_rgba(16,55,92,0.08)]"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <label className="flex items-center cursor-pointer group/check">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="text-[#10375C] focus:ring-[#10375C]/20 border-gray-300 rounded transition-colors group-hover/check:border-[#10375C]"
                                />
                                <span className="ms-2 text-sm text-gray-600 group-hover/check:text-[#10375C] transition-colors">Ingat saya</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-gray-500 hover:text-[#10375C] font-medium transition-colors duration-200"
                                >
                                    Lupa password?
                                </Link>
                            )}
                        </div>

                        <div className="mt-8 animate-btn-delay">
                            <PrimaryButton 
                                className="relative w-full flex justify-center py-3.5 bg-gradient-to-r from-[#10375C] to-[#246abf] hover:from-[#0c2a47] hover:to-[#1a5b96] text-white text-sm font-heading font-bold tracking-widest rounded-xl transition-all duration-300 shadow-lg hover:shadow-[0_10px_25px_rgba(16,55,92,0.3)] hover:-translate-y-1 overflow-hidden group" 
                                disabled={processing}
                            >
                                <span className="relative z-10">Log in</span>
                                <div className="absolute top-0 -left-[100%] w-[150%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:animate-button-shine"></div>
                            </PrimaryButton>
                        </div>
                    </form>

                    {/* === TAMBAHAN: LINK KE HALAMAN REGISTER === */}
                    <div className="mt-6 text-center animate-btn-delay">
                        <p className="text-sm text-gray-500 font-light">
                            Belum punya akun?{' '}
                            <Link
                                href={route('register')}
                                className="font-medium text-[#10375C] hover:text-[#246abf] hover:underline transition-all duration-200"
                            >
                                Daftar sekarang
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}