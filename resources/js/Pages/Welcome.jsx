import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

// Jalur gambar (bisa Anda sesuaikan dengan aset Anda)
const HERO_IMAGE = "/image/hero-pustaka.png";

export default function Welcome({ auth }) {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [popularFilter, setPopularFilter] = useState('Semua');
    const [popularSubFilter, setPopularSubFilter] = useState('Semua Jenis');
    const categoryRef = useRef(null);
    const [isCategoryVisible, setIsCategoryVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Efek Deteksi Scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsCategoryVisible(true);
                }
            },
            { threshold: 0.15 } 
        );

        if (categoryRef.current) {
            observer.observe(categoryRef.current);
        }

        return () => {
            if (categoryRef.current) {
                observer.unobserve(categoryRef.current);
            }
        };
    }, []);

    const categories = [
        { 
            id: 1, 
            title: 'Fiksi', 
            desc: 'Gerbang menuju dunia imajinatif, untaian prosa naratif, dan kisah-kisah yang menghanyutkan emosi.', 
            isFeatured: true,
            items: ['Novel & Sastra Klasik', 'Misteri, Kriminal & Thriller', 'Fantasi & Sci-Fi (Sains Fiksi)', 'Romansa & Drama Populer']
        },
        { 
            id: 2, 
            title: 'Non-Fiksi', 
            desc: 'Eksplorasi wawasan dunia nyata, rekaman sejarah, sains fundamental, hingga pengembangan potensi diri.', 
            isFeatured: false,
            items: ['Pengembangan Diri & Motivasi', 'Biografi & Memoar Tokoh', 'Bisnis, Finansial & Investasi', 'Sains, Teknologi & Filsafat']
        }
    ];

    const popularBooks = [
        { id: 1, title: 'Bumi Manusia', year: '1980', category: 'Fiksi', type: 'Novel & Sastra Klasik', cover: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1565658920l/1398034._SY475_.jpg' },
        { id: 2, title: 'Sapiens: A Brief History of Humankind', year: '2011', category: 'Non-Fiksi', type: 'Sains, Teknologi & Filsafat' },
        { id: 3, title: 'Laut Bercerita', year: '2017', category: 'Fiksi', type: 'Novel & Sastra Klasik' },
        { id: 4, title: 'Atomic Habits', year: '2018', category: 'Non-Fiksi', type: 'Pengembangan Diri & Motivasi' },
        { id: 5, title: 'Cantik Itu Luka', year: '2002', category: 'Fiksi', type: 'Novel & Sastra Klasik' },
        { id: 6, title: 'The Psychology of Money', year: '2020', category: 'Non-Fiksi', type: 'Bisnis, Finansial & Investasi' },
        { id: 7, title: 'Sherlock Holmes: A Study in Scarlet', year: '1887', category: 'Fiksi', type: 'Misteri, Kriminal & Thriller' },
        { id: 8, title: 'Filosofi Teras', year: '2018', category: 'Non-Fiksi', type: 'Pengembangan Diri & Motivasi' },
        { id: 9, title: 'Harry Potter & Philosopher\'s Stone', year: '1997', category: 'Fiksi', type: 'Fantasi & Sci-Fi (Sains Fiksi)' },
        { id: 10, title: 'Steve Jobs', year: '2011', category: 'Non-Fiksi', type: 'Biografi & Memoar Tokoh' },
    ];

    const filteredBooks = popularBooks.filter(book => {
        const matchMain = popularFilter === 'Semua' || book.category === popularFilter;
        const matchSub = popularSubFilter === 'Semua Jenis' || book.type === popularSubFilter;
        return matchMain && matchSub;
    }).slice(0, 10);

    const currentSubOptions = popularFilter === 'Semua' 
        ? [] 
        : categories.find(c => c.title === popularFilter)?.items || [];

    return (
        <>
            <Head title="PusGitHub" />
            
            <div className="min-h-screen bg-[#F4F7FA] text-slate-700 font-sans antialiased selection:bg-yellow-400 selection:text-slate-900">
                
                {/* 1. NAVBAR */}
                <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* KELOMPOK KIRI: LOGO (Sendirian di kiri) */}
        <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-9 h-9 bg-[#0B3A60] rounded-lg flex items-center justify-center text-yellow-400 group-hover:bg-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z" />
                </svg>
            </div>
            <span className="text-xl font-black text-[#0B3A60] tracking-tight">Pustaka<span className="text-blue-600">DIGITAL</span></span>
        </div>
        
        {/* KELOMPOK KANAN: MENU + AUTH BUTTON */}
        <div className="flex items-center gap-12">
            {/* Menu Navigasi (Nempel ke kanan, berjarak dengan tombol login melalui gap-12) */}
            <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
                <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Home</a>
                <a href="#book-categories" className="hover:text-blue-600 transition-colors">Kategori</a>
                <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>

            {/* Auth Button */}
            <div className="flex items-center gap-4">
                {auth?.user ? (
                    <Link href={route('login')} className="text-xs font-bold uppercase tracking-wider bg-yellow-400 hover:bg-yellow-500 text-[#0B3A60] px-5 py-2.5 rounded-full transition-all shadow-md">
                        login
                    </Link>
                ) : (
                    <>
                        <Link href={route('login')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition">Log in</Link>
                        <Link href={route('register')} className="text-xs font-bold uppercase tracking-wider bg-[#0B3A60] hover:bg-blue-600 text-white px-5 py-2.5 rounded-full transition-all shadow-md">Daftar</Link>
                    </>
                )}
            </div>
        </div>

    </div>
</nav>

                {/* MAIN CONTENT WRAPPER */}
                <main className={`pt-20 max-w-7xl mx-auto px-6 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    
                    {/* 2. HERO SECTION */}
                    <div className="relative grid md:grid-cols-2 gap-12 items-center py-20 md:py-28 overflow-hidden">
                        <div className="absolute top-1/4 right-[-10%] w-[50rem] h-[35rem] bg-gradient-to-tr from-blue-100/40 to-yellow-100/30 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] -z-10 blur-3xl"></div>

                        {/* Kolom Kiri */}
                        <div className="space-y-6 max-w-lg">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0B3A60] leading-[1.15]">
                                Jadilah <br /> 
                                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">lebih cerdas</span><br />
                                dengan
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500"> satu buku</span> setiap hari.
                            </h1>
                            <p className="text-base text-slate-500 leading-relaxed">
                                PustakaDIGITAL menyediakan akses perpustakaan digital yang modern, efisien, dan siap memenuhi kebutuhan literasi setiap waktu.
                            </p>
                            <a href="#book-categories" className="inline-flex items-center justify-center bg-[#0B3A60] hover:bg-blue-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-blue-600/20 transition-all transform hover:-translate-y-0.5">
                                Lihat Kategori
                            </a>
                        </div>

                        {/* Kolom Kanan */}
                       {/* Kolom Kanan */}
<div className="flex justify-center md:justify-end relative">
    {/* Ditambahkan md:-translate-x-10 untuk menggeser wadah gambar ke kiri pada layar desktop */}
    <div className="relative w-full max-w-md p-6 md:-translate-x-10">
        <img 
            src={HERO_IMAGE} 
            alt="Academic Illustration" 
            className="w-full h-auto object-contain drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]"
        />
        <div className="absolute top-10 right-10 w-12 h-12 border-2 border-yellow-400/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-4 left-10 w-6 h-6 bg-blue-500/15 rounded-md rotate-45"></div>
    </div>
</div>
                    </div>

                    {/* 3. KATEGORI BUKU SECTION (ANIMASI BERGANTIAN DITERAPKAN DI SINI) */}
                    <section 
                        id="book-categories" 
                        ref={categoryRef}
                        className="py-24 text-center scroll-mt-20"
                    >
                        {/* URUTAN 1: Teks Header muncul duluan (Tanpa Delay) */}
                        <div className={`transition-all duration-700 ease-out transform ${
                            isCategoryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}>
                            <span className="text-xs font-black tracking-widest text-blue-600 uppercase block mb-3">RUANG BACA</span>
                            <h2 className="text-3xl md:text-4xl font-black text-[#0B3A60] mb-4">KATEGORI BUKU</h2>
                            <p className="text-slate-400 text-sm max-w-md mx-auto mb-16">Pilih rumpun literatur yang sesuai dengan minat Anda untuk melihat sub-kategori di dalamnya.</p>
                        </div>
                        
                        {/* Grid 2 Kolom */}
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-6 items-start">
                            {categories.map((category, index) => (
                                /* URUTAN 2 & 3: Div Wrapper ini hanya bertugas mengangkat kotak ke atas secara bergantian */
                                <div 
                                    key={category.id}
                                    className={`transition-all duration-1000 ease-out transform ${
                                        isCategoryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'
                                    }`}
                                    /* Index 0 (Kiri) delay 400ms, Index 1 (Kanan) delay 800ms */
                                    style={{ transitionDelay: `${(index + 1) * 400}ms` }} 
                                >
                                    {/* Isi Kartu (Hover transition dipisahkan agar tetap cepat/responsif) */}
                                    <div 
                                        className={`rounded-[2rem] p-10 text-left transition-all duration-500 shadow-sm border relative overflow-hidden ${
                                            category.isFeatured 
                                            ? 'bg-[#0B3A60] text-white shadow-xl shadow-blue-900/20 border-transparent' 
                                            : 'bg-white text-slate-700 hover:shadow-2xl border-slate-100 hover:border-blue-200/60'
                                        }`}
                                    >
                                        {/* Aksen Estetik */}
                                        {category.isFeatured && (
                                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                                        )}

                                        {/* Bagian Header Kartu */}
                                        <div 
                                            onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                                            className="cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-center mb-5">
                                                <h3 className={`text-3xl font-black tracking-tight ${category.isFeatured ? 'text-white' : 'text-[#0B3A60]'}`}>
                                                    {category.title}
                                                </h3>
                                                <div className={`p-2 rounded-full transition-transform duration-300 ${expandedCategory === category.id ? 'rotate-180' : 'rotate-0'} ${category.isFeatured ? 'bg-white/10 text-yellow-400' : 'bg-blue-50 text-blue-600'}`}>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            <p className={`text-sm leading-relaxed mb-4 ${category.isFeatured ? 'text-blue-100/80' : 'text-slate-500'}`}>
                                                {category.desc}
                                            </p>
                                        </div>

                                        {/* Bagian Sub-Kategori */}
                                        <div 
                                            className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                                expandedCategory === category.id 
                                                ? 'max-h-[500px] opacity-100 mt-8' 
                                                : 'max-h-0 opacity-0 mt-0'
                                            }`}
                                        >
                                            <div className={`h-px w-full mb-6 ${category.isFeatured ? 'bg-blue-500/30' : 'bg-slate-100'}`}></div>

                                            <div className="space-y-3.5">
                                                {category.items.map((subItem, subIndex) => (
                                                    <div 
                                                        key={subIndex}
                                                        onClick={() => setSelectedCategory({ title: category.title, currentSub: subItem })}
                                                        className={`group/item flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                                                            category.isFeatured 
                                                            ? 'bg-blue-950/30 border-blue-800/20 hover:bg-yellow-400 hover:text-[#0B3A60] hover:border-transparent hover:shadow-lg hover:shadow-yellow-400/10' 
                                                            : 'bg-slate-50/60 border-transparent hover:bg-[#0B3A60] hover:text-white hover:shadow-lg hover:shadow-blue-900/10'
                                                        }`}
                                                    >
                                                        <span className="text-sm font-bold tracking-wide">{subItem}</span>
                                                        <svg className="w-4 h-4 transform -translate-x-2 opacity-0 group-hover/item:translate-x-0 group-hover/item:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3.5 BUKU POPULER SECTION */}
                    <section className="py-16 scroll-mt-20 border-t border-slate-100 bg-slate-50/40">
    <div className="max-w-7xl mx-auto px-6">
        
        {/* Header dan Filter Utama */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
            <div>
                <span className="text-xs font-black tracking-widest text-blue-600 uppercase block mb-2">TRENDING SEKARANG</span>
                <h2 className="text-3xl font-black text-[#0B3A60]">Koleksi Paling Populer</h2>
            </div>
            
            <div className="flex bg-white border border-slate-200 p-1 rounded-full shadow-sm">
                {['Semua', 'Fiksi', 'Non-Fiksi'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => {
                            setPopularFilter(filter);
                            setPopularSubFilter('Semua Jenis');
                        }}
                        className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                            popularFilter === filter 
                            ? 'bg-[#0B3A60] text-white shadow-md' 
                            : 'text-slate-500 hover:text-[#0B3A60] hover:bg-slate-50'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>

        {/* Sub-Filter Baris Kedua */}
        {popularFilter !== 'Semua' && (
            <div className="flex flex-wrap gap-2 mb-10 pb-2 border-b border-slate-100 animate-[fadeIn_0.3s_ease-out]">
                <button
                    onClick={() => setPopularSubFilter('Semua Jenis')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        popularSubFilter === 'Semua Jenis'
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                    }`}
                >
                    Tampilkan Semua {popularFilter}
                </button>
                
                {currentSubOptions.map((subOption) => (
                    <button
                        key={subOption}
                        onClick={() => setPopularSubFilter(subOption)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            popularSubFilter === subOption
                            ? 'bg-blue-600 text-white shadow-sm border border-transparent'
                            : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                        }`}
                    >
                        {subOption}
                    </button>
                ))}
            </div>
        )}

        {/* Grid Buku Populer */}
        {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredBooks.map((book, index) => (
                    <div 
                        key={book.id}
                        className="group flex flex-col cursor-pointer animate-[fadeIn_0.4s_ease-out_forwards]"
                        style={{ animationDelay: `${index * 40}ms`, opacity: 0 }}
                    >
                        {/* WADAH COVER BUKU */}
                        <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 mb-4 bg-slate-200">
                            
                            {/* Pengecekan Kondisional Kondisi Foto */}
                            {book.cover ? (
                                // Jika ada data 'cover', tampilkan Tag Gambar ini:
                                <img 
                                    src={book.cover} 
                                    alt={book.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            ) : (
                                // Jika TIDAK ada data 'cover', tampilkan Gradasi Warna asli:
                                <div className={`absolute inset-0 bg-gradient-to-br ${
                                    book.category === 'Fiksi' 
                                    ? 'from-blue-600 to-blue-900' 
                                    : 'from-slate-700 to-slate-900'
                                }`}></div>
                            )}
                            
                            {/* Efek Garis Lipatan Punggung Buku Biar Estetik */}
                            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/20 via-transparent to-transparent"></div>
                            <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10"></div>
                            
                            <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                                <span className="text-[9px] font-black tracking-wider text-white bg-black/40 backdrop-blur-[2px] w-max px-2 py-0.5 rounded-md uppercase">
                                    {book.category}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1 px-1">
                            <span className="text-[11px] font-bold text-blue-600/80 block uppercase tracking-wide">
                                {book.type.split(' & ')[0]}
                            </span>
                            
                            <h4 className="font-black text-[#0B3A60] text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                {book.title}
                            </h4>
                            
                            <p className="text-xs font-semibold text-slate-400">
                                Tahun {book.year}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                <p className="text-sm font-medium text-slate-400">Belum ada koleksi populer untuk jenis ini.</p>
            </div>
        )}
    </div>
</section>

                    {/* 4. ABOUT US SECTION */}
                    <section id="about" className="py-20 scroll-mt-20 grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <span className="text-xs font-black tracking-widest text-blue-600 uppercase block">ABOUT US</span>
                            <h2 className="text-3xl font-black text-[#0B3A60]">Jadilah lebih cerdas dengan satu buku setiap hari.</h2>
                            <div className="space-y-4 text-sm text-slate-500 leading-relaxed">
                                <p>Pustaka Digital adalah platform perpustakaan digital yang memudahkan Anda meminjam dan membaca buku favorit secara instan langsung melalui browser. Kami hadir untuk membuat akses literasi menjadi lebih praktis dan efisien, memungkinkan Anda menjelajahi ribuan koleksi tanpa perlu menginstal aplikasi tambahan.</p>
                                <p>Demi kenyamanan bersama, kami menerapkan sistem masa pinjam yang teratur agar koleksi tetap tersedia bagi semua pengguna. Harap diperhatikan bahwa keterlambatan pengembalian buku akan dikenakan denda sesuai ketentuan sebagai bentuk tanggung jawab kita bersama.</p>
                                <p className="font-semibold text-[#0B3A60]">Literasi dalam satu klik</p>
                            </div>
                        </div>

                        <div className="space-y-4 max-w-md mx-auto w-full">
                            {[
                                { title: "AKSES FLEKSIBEL", color: "bg-blue-600 text-white" },
                                { title: "KOLEKSI TANPA BATAS", color: "bg-[#0B3A60] text-white" },
                                { title: "PEMINJAMAN CEPAT", color: "bg-yellow-400 text-slate-900" },
                                { title: "KOLEKSI EKSKLUSIF", color: "bg-emerald-600 text-white" }
                            ].map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-50 hover:shadow-md transition-shadow transform hover:scale-[1.02]"
                                    style={{ transform: `translateX(${idx * 12}px)` }}
                                >
                                    <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold ${item.color}`}>
                                        {idx + 1}
                                    </div>
                                    <span className="text-sm font-black text-[#0B3A60] tracking-wide">{item.title}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 5. GALLERY SECTION */}
                    <section className="my-12 bg-[#0B3A60] text-white rounded-[2.5rem] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400/10 rounded-br-full"></div>
                        
                        <div className="relative z-10 max-w-4xl mx-auto mb-12">
                            <span className="text-xs font-black tracking-widest text-yellow-400 uppercase block mb-2">GALLERY</span>
                            <h2 className="text-3xl md:text-4xl font-black mb-3">Great teachers make great students.</h2>
                            <p className="text-sm font-medium text-blue-200 tracking-widest uppercase">Dream | Plan | Fly</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                            <div className="bg-blue-950/40 rounded-2xl h-64 md:h-80 overflow-hidden relative group border border-white/10">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent opacity-60"></div>
                                <div className="absolute bottom-4 left-4 text-left text-xs font-bold">Class Activity 01</div>
                            </div>
                            <div className="grid gap-4 col-span-1">
                                <div className="bg-blue-950/40 rounded-xl h-32 md:h-[9.5rem] overflow-hidden border border-white/10"></div>
                                <div className="bg-blue-950/40 rounded-xl h-32 md:h-[9.5rem] overflow-hidden border border-white/10"></div>
                            </div>
                            <div className="bg-blue-950/40 rounded-2xl h-64 md:h-80 overflow-hidden border border-white/10 col-span-1"></div>
                            <div className="bg-blue-950/40 rounded-2xl h-64 md:h-80 overflow-hidden border border-white/10 hidden md:block"></div>
                        </div>
                    </section>

                </main>

                {/* FOOTER */}
                <footer className="border-t border-slate-200 bg-white py-8 text-center mt-20">
                    <p className="text-slate-400 text-xs font-medium">
                        &copy; {new Date().getFullYear()} The Planner Education. All Rights Reserved. Modified with Blue-Yellow Fusion.
                    </p>
                </footer>

                {/* POP-UP DETAIL KATEGORI & SUB-KATEGORI */}
                {selectedCategory !== null && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-[fadeIn_0.2s_ease-out]">
                            <div className="p-6 bg-[#0B3A60] text-white flex justify-between items-center">
                                <span className="text-xs font-black tracking-widest text-yellow-400 uppercase">Katalog Pustaka</span>
                                <button onClick={() => setSelectedCategory(null)} className="text-white/80 hover:text-yellow-400 p-1 rounded-lg transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-8 space-y-5 text-center">
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider px-3 py-1 bg-blue-50 rounded-full">
                                    Kategori: {selectedCategory.title}
                                </span>
                                <h2 className="text-2xl font-black text-[#0B3A60] leading-snug mt-2">
                                    {selectedCategory.currentSub}
                                </h2>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Menampilkan arsip buku, modul materi, serta rekomendasi literatur pilihan terbaik untuk topik ini.
                                </p>
                                <div className="pt-4">
                                    <button className="w-full bg-[#0B3A60] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md text-sm tracking-wide">
                                        Buka Rak Buku Digital
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom CSS Animation Keyframes */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </>
    );
}
