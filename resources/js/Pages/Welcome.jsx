import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

const HERO_IMAGE = "/image/hero-pustaka.png";

    // Ganti fungsi AnimatedCounter yang lama dengan yang ini
function AnimatedCounter({ target, suffix = "+" }) {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const counterRef = useRef(null);

    // Observer untuk mengecek apakah elemen sudah terlihat di layar
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Jika elemen masuk ke layar dan belum pernah dianimasikan
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                }
            },
            { threshold: 0.5 } // Angka mulai berjalan saat 50% bagian elemen ini terlihat
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => {
            if (counterRef.current) observer.disconnect();
        };
    }, [hasAnimated]);

    // Efek menjalankan angka jika hasAnimated = true
    useEffect(() => {
        if (!hasAnimated) return;

        let start = 0;
        const duration = 2000; // Animasi berjalan selama 2 detik
        const increment = target / (duration / 16); 

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.ceil(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [target, hasAnimated]);

    // Tambahkan ref ke tag span ini
    return <span ref={counterRef} className="inline-block">{count}{suffix}</span>;
}
export default function Welcome({ auth }) {
    const [isVisible, setIsVisible] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [popularFilter, setPopularFilter] = useState('Semua');
    const [popularSubFilter, setPopularSubFilter] = useState('Semua Jenis');
    const [activeTab, setActiveTab] = useState('home');
    
    // Observers Refs
    const categoryRef = useRef(null);
    const popularRef = useRef(null);
    const aboutRef = useRef(null);
    const searchBarRef = useRef(null);

    // Visibility States
    const [isCategoryVisible, setIsCategoryVisible] = useState(false); 
    const [isPopularVisible, setIsPopularVisible] = useState(false); 
    const [isAboutVisible, setIsAboutVisible] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [katalogKategori, setKatalogKategori] = useState('Semua');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownCategories = [
        { id: 1, title: 'Fiksi', items: ['Novel & Sastra Klasik', 'Misteri, Kriminal & Thriller', 'Fantasi & Sci-Fi (Sains Fiksi)', 'Romansa & Drama Populer'] },
        { id: 2, title: 'Non-Fiksi', items: ['Pengembangan Diri & Motivasi', 'Biografi & Memoar Tokoh', 'Bisnis, Finansial & Investasi', 'Sains, Teknologi & Filsafat'] }
    ];

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Bisa ganti 'auto' jika tidak ingin ada efek meluncur
        });
    }, [activeTab]);

    // Reset state visibilitas saat pindah dari tab home
    useEffect(() => {
        if (activeTab !== 'home') {
            setIsCategoryVisible(false);
            setIsPopularVisible(false);
            setIsAboutVisible(false);
        }
    }, [activeTab]);

    useEffect(() => {
        const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

        const categoryObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setIsCategoryVisible(true); categoryObserver.disconnect(); }
        }, { threshold: 0.1, rootMargin: "0px 0px -100px 0px" });

        const popularObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setIsPopularVisible(true); popularObserver.disconnect(); }
        }, observerOptions);

        const aboutObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setIsAboutVisible(true); aboutObserver.disconnect(); }
        }, observerOptions);

        if (categoryRef.current) categoryObserver.observe(categoryRef.current);
        if (popularRef.current) popularObserver.observe(popularRef.current);
        if (aboutRef.current) aboutObserver.observe(aboutRef.current);

        return () => { 
            categoryObserver.disconnect(); 
            popularObserver.disconnect(); 
            aboutObserver.disconnect();
        };
    },[activeTab]);

    const categories = [
        { id: 1, title: 'Fiksi', desc: 'Gerbang menuju dunia imajinatif, untaian prosa naratif, dan kisah-kisah yang menghanyutkan emosi.', isFeatured: true, items: ['Novel & Sastra Klasik', 'Misteri, Kriminal & Thriller', 'Fantasi & Sci-Fi (Sains Fiksi)', 'Romansa & Drama Populer'] },
        { id: 2, title: 'Non-Fiksi', desc: 'Eksplorasi wawasan dunia nyata, rekaman sejarah, sains fundamental, hingga pengembangan potensi diri.', isFeatured: false, items: ['Pengembangan Diri & Motivasi', 'Biografi & Memoar Tokoh', 'Bisnis, Finansial & Investasi', 'Sains, Teknologi & Filsafat'] }
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
        { id: 11, title: 'Rich Dad Poor Dad', year: '1997', category: 'Non-Fiksi', type: 'Bisnis, Finansial & Investasi' },
        { id: 12, title: 'Bintang', year: '2017', category: 'Fiksi', type: 'Fantasi & Sci-Fi (Sains Fiksi)' },
        { id: 13, title: 'Thinking, Fast and Slow', year: '2011', category: 'Non-Fiksi', type: 'Sains, Teknologi & Filsafat' },
        { id: 14, title: 'Gadis Kretek', year: '2012', category: 'Fiksi', type: 'Romansa & Drama Populer' },
        { id: 15, title: 'Laskar Pelangi', year: '2005', category: 'Fiksi', type: 'Novel & Sastra Klasik' },
        { id: 16, title: 'Murder on the Orient Express', year: '1934', category: 'Fiksi', type: 'Misteri, Kriminal & Thriller' },
        { id: 17, title: 'The Lean Startup', year: '2011', category: 'Non-Fiksi', type: 'Bisnis, Finansial & Investasi' },
        { id: 18, title: 'Dune', year: '1965', category: 'Fiksi', type: 'Fantasi & Sci-Fi (Sains Fiksi)' },
        { id: 19, title: 'Sebuah Seni untuk Bersikap Bodo Amat', year: '2016', category: 'Non-Fiksi', type: 'Pengembangan Diri & Motivasi' },
        { id: 20, title: 'Tenggelamnya Kapal Van der Wijck', year: '1938', category: 'Fiksi', type: 'Romansa & Drama Populer' },
        { id: 21, title: 'Cosmos', year: '1980', category: 'Non-Fiksi', type: 'Sains, Teknologi & Filsafat' },
        { id: 22, title: 'Pride and Prejudice', year: '1813', category: 'Fiksi', type: 'Romansa & Drama Populer' },
        { id: 23, title: 'Elon Musk: Tesla, SpaceX', year: '2015', category: 'Non-Fiksi', type: 'Biografi & Memoar Tokoh' },
        { id: 24, title: 'Hujan', year: '2016', category: 'Fiksi', type: 'Romansa & Drama Populer' }
    ];

    const filteredBooks = popularBooks.filter(book => {
        const matchMain = popularFilter === 'Semua' || book.category === popularFilter;
        const matchSub = popularSubFilter === 'Semua Jenis' || book.type === popularSubFilter;
        return matchMain && matchSub;
    }).slice(0, 10);

    const currentSubOptions = popularFilter === 'Semua' ? [] : categories.find(c => c.title === popularFilter)?.items || [];

    return (
        <>
            <Head title="PusGitHub" />
            <div className="min-h-screen bg-[#F4F7FA] text-slate-700 font-sans antialiased selection:bg-yellow-400 selection:text-slate-900">
                
                {/* NAVBAR */}
                <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setActiveTab('home')}>
                            <div className="w-9 h-9 bg-[#0B3A60] rounded-lg flex items-center justify-center text-yellow-400 group-hover:bg-blue-600 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z" /></svg>
                            </div>
                            <span className="text-xl font-black text-[#0B3A60] tracking-tight">Pustaka<span className="text-blue-600">DIGITAL</span></span>
                        </div>
                        
                        <div className="flex items-center gap-12">
                            <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
                                <button onClick={() => setActiveTab('home')} className={`pb-1 transition-colors ${activeTab === 'home' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600'}`}>Home</button>
                                <button onClick={() => setActiveTab('kategori')} className={`pb-1 transition-colors ${activeTab === 'kategori' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600'}`}>Kategori</button>
                              
                               {/* Dropdown About */}
                                <div className="relative group">
                                    <button className={`pb-1 flex items-center gap-1.5 transition-colors cursor-pointer ${['tentang', 'bantuan', 'kontak', 'faq', 'privasi', 'syarat'].includes(activeTab) ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600'}`}>
                                        About
                                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute top-full right-0 lg:left-1/2 lg:-translate-x-1/2 pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                                        <div className="bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(11,58,96,0.15)] border border-slate-100 overflow-hidden py-2">
                                            {[
                                                { label: 'Tentang Pustaka Digital', id: 'tentang' },
                                                { label: 'Pusat Bantuan', id: 'bantuan' },
                                                { label: 'Syarat & Ketentuan', id: 'syarat' },
                                                { label: 'Kebijakan Privasi', id: 'privasi' }
                                            ].map((item, index) => (
                                                <button 
                                                    key={index} 
                                                    onClick={() => setActiveTab(item.id)} 
                                                    className="w-full text-left block px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-5">
                                {auth?.user ? (
                                    <div className="flex items-center gap-4">
                                        <span className="hidden sm:block text-sm font-semibold text-slate-700">Halo, {auth.user.name.split(' ')[0]}</span>
                                        <Link href={route('dashboard')} className="group relative">
                                            <div className="w-10 h-10 rounded-full border-2 border-blue-600/20 p-0.5 group-hover:border-blue-600 transition-all duration-300">
                                                {auth.user.profile_photo_url ? (
                                                    <img src={auth.user.profile_photo_url} alt={auth.user.name} className="w-full h-full rounded-full object-cover shadow-sm"/>
                                                ) : (
                                                    <div className="w-full h-full rounded-full bg-[#0B3A60] flex items-center justify-center text-white text-sm font-bold shadow-md">{auth.user.name.charAt(0).toUpperCase()}</div>
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="text-sm font-bold text-slate-500 hover:text-[#0B3A60] transition-colors">Log in</Link>
                                        <Link href={route('register')} className="text-xs font-bold uppercase tracking-wider bg-[#0B3A60] hover:bg-[#072640] text-white px-6 py-2.5 rounded-full transition-all shadow-lg hover:shadow-[#0B3A60]/30 transform hover:-translate-y-0.5">Daftar</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                <main className={`pt-28 pb-10 max-w-7xl mx-auto px-6 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    
                    {/* TAMPILAN HOME */}
                    {activeTab === 'home' && (
                        <div className="animate-fade-in">
                            {/* HERO SECTION */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-10">
                                <div className="space-y-6 max-w-xl text-left">
                                    <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B3A60] leading-tight tracking-tight">
                                        <span className="inline-block opacity-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>Jadilah&nbsp;</span>
                                        <span className="inline-block opacity-0 animate-fade-up text-transparent bg-clip-text bg-gradient-to-r from-[#16355A] to-[#FFCE00]" style={{ animationDelay: '0.3s' }}>lebih cerdas&nbsp;</span>
                                        <span className="inline-block opacity-0 animate-fade-up" style={{ animationDelay: '0.5s' }}>dengan&nbsp;</span>
                                        <span className="inline-block opacity-0 animate-fade-up text-transparent bg-clip-text bg-gradient-to-r from-[#FFCE00] to-[#16355A]" style={{ animationDelay: '0.7s' }}>satu buku&nbsp;</span>
                                        <span className="inline-block opacity-0 animate-fade-up" style={{ animationDelay: '0.9s' }}>setiap hari.</span>
                                    </h1>
                                    <p className="text-base md:text-lg text-slate-500 leading-relaxed opacity-0 animate-fade-up max-w-md" style={{ animationDelay: '1.1s' }}>
                                        PustakaDIGITAL menyediakan akses perpustakaan digital yang modern, efisien, dan siap memenuhi kebutuhan literasi setiap waktu.
                                    </p>
                                    <div className="opacity-0 animate-fade-up" style={{ animationDelay: '1.3s' }}>
                                        <button onClick={() => setActiveTab('kategori')} className="inline-flex items-center justify-center bg-[#0B3A60] hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5">Lihat Kategori</button>
                                    </div>
                                </div>
                                <div className="flex justify-center md:justify-end relative">
                                    <div className="relative w-full max-w-md p-6 md:-translate-x-10">
                                        <img src={HERO_IMAGE} alt="Academic Illustration" className="w-full h-auto object-contain drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]" />
                                        <div className="absolute top-10 right-10 w-12 h-12 border-2 border-yellow-400/40 rounded-full animate-ping"></div>
                                        <div className="absolute bottom-4 left-10 w-6 h-6 bg-blue-500/15 rounded-md rotate-45"></div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION KATEGORI */}
                            <section id="book-categories" ref={categoryRef} className="py-16 text-center scroll-mt-20">
                                <div className={`transition-all duration-700 ease-out transform ${isCategoryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                    <span className="text-xs font-black tracking-widest text-blue-600 uppercase block mb-3">RUANG BACA</span>
                                    <h2 className="text-3xl md:text-4xl font-black text-[#0B3A60] mb-4">KATEGORI BUKU</h2>
                                    <p className="text-slate-400 text-sm max-w-md mx-auto mb-16">Pilih rumpun literatur yang sesuai dengan minat Anda untuk melihat sub-kategori di dalamnya.</p>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-6 items-start">
                                    {categories.map((category, index) => (
                                        <div key={category.id} className={`transition-all duration-700 ease-out transform ${isCategoryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`} style={{ transitionDelay: `${(index * 200) + 200}ms` }}>
                                            <div className={`rounded-[2rem] p-10 text-left transition-all duration-500 shadow-sm border relative overflow-hidden ${category.isFeatured ? 'bg-[#0B3A60] text-white shadow-xl shadow-blue-900/20 border-transparent' : 'bg-white text-slate-700 hover:shadow-2xl border-slate-100 hover:border-blue-200/60'}`}>
                                                {category.isFeatured && <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none"></div>}
                                                <div onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)} className="cursor-pointer group">
                                                    <div className="flex justify-between items-center mb-5">
                                                        <h3 className={`text-3xl font-black tracking-tight ${category.isFeatured ? 'text-white' : 'text-[#0B3A60]'}`}>{category.title}</h3>
                                                        <div className={`p-2 rounded-full transition-transform duration-300 ${expandedCategory === category.id ? 'rotate-180' : 'rotate-0'} ${category.isFeatured ? 'bg-white/10 text-yellow-400' : 'bg-blue-50 text-blue-600'}`}>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                                        </div>
                                                    </div>
                                                    <p className={`text-sm leading-relaxed mb-4 ${category.isFeatured ? 'text-blue-100/80' : 'text-slate-500'}`}>{category.desc}</p>
                                                </div>

                                                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedCategory === category.id ? 'max-h-[500px] opacity-100 mt-8' : 'max-h-0 opacity-0 mt-0'}`}>
                                                    <div className={`h-px w-full mb-6 ${category.isFeatured ? 'bg-blue-500/30' : 'bg-slate-100'}`}></div>
                                                    <div className="space-y-3.5">
                                                        {category.items.map((subItem, subIndex) => (
                                                            <div key={subIndex} onClick={() => { setActiveTab('kategori'); setKatalogKategori(subItem); setTimeout(() => { searchBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100); }} className={`group/item flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${category.isFeatured ? 'bg-blue-950/30 border-blue-800/20 hover:bg-yellow-400 hover:text-[#0B3A60] hover:border-transparent hover:shadow-lg hover:shadow-yellow-400/10' : 'bg-slate-50/60 border-transparent hover:bg-[#0B3A60] hover:text-white hover:shadow-lg hover:shadow-blue-900/10'}`}>
                                                                <span className="text-sm font-bold tracking-wide">{subItem}</span>
                                                                <svg className="w-4 h-4 transform -translate-x-2 opacity-0 group-hover/item:translate-x-0 group-hover/item:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7-7" /></svg>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* SECTION POPULER */}
                            <section ref={popularRef} className="py-16 scroll-mt-20 border-t border-slate-100 bg-slate-50/40 overflow-hidden">
                                <div className="max-w-7xl mx-auto">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                                        <div className={`transition-all duration-700 ease-out ${isPopularVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                            <span className="text-xs font-black tracking-widest text-blue-600 uppercase block mb-2">TRENDING SEKARANG</span>
                                            <h2 className="text-3xl font-black text-[#0B3A60]">Koleksi Paling Populer</h2>
                                        </div>
                                        <div className={`flex bg-white border border-slate-200 p-1.5 rounded-full shadow-sm relative z-10 transition-all duration-700 ease-out delay-200 ${isPopularVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                            {['Semua', 'Fiksi', 'Non-Fiksi'].map((filter) => (
                                                <button key={filter} onClick={() => { setPopularFilter(filter); setPopularSubFilter('Semua Jenis'); }} className={`relative px-6 py-2 rounded-full text-xs font-bold transition-all duration-500 ease-out overflow-hidden ${popularFilter === filter ? 'text-white shadow-md' : 'text-slate-500 hover:text-[#0B3A60] hover:bg-slate-50'}`}>
                                                    {popularFilter === filter && <div className="absolute inset-0 bg-[#0B3A60] rounded-full -z-10 animate-[fadeIn_0.3s_ease-out]"></div>}
                                                    <span className="relative z-10">{filter}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {popularFilter !== 'Semua' && (
                                        <div className={`flex flex-wrap gap-2 mb-10 pb-2 border-b border-slate-100 transition-all duration-700 delay-300 ${isPopularVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                            <button onClick={() => setPopularSubFilter('Semua Jenis')} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${popularSubFilter === 'Semua Jenis' ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 hover:-translate-y-0.5'}`}>Tampilkan Semua {popularFilter}</button>
                                            {currentSubOptions.map((subOption) => (
                                                <button key={subOption} onClick={() => setPopularSubFilter(subOption)} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${popularSubFilter === subOption ? 'bg-blue-600 text-white shadow-md border border-transparent' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 hover:-translate-y-0.5'}`}>{subOption}</button>
                                            ))}
                                        </div>
                                    )}

                                    {filteredBooks.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                            {filteredBooks.map((book, index) => (
                                               <div 
        key={book.id} 
        onClick={() => window.location.href = route('login')} // Tambahkan baris ini
        className={`group flex flex-col cursor-pointer transition-all duration-700 ease-out ${isPopularVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`} 
        style={{ transitionDelay: `${200 + (index * 100)}ms` }}
    >
          <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden transition-all duration-500 ease-out transform group-hover:-translate-y-2.5 shadow-sm group-hover:shadow-[0_20px_40px_-15px_rgba(11,58,96,0.3)] mb-4 bg-slate-200">
                                                        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shine z-20 pointer-events-none"></div>
                                                        {book.cover ? (
                                                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy" />
                                                        ) : (
                                                            <div className={`absolute inset-0 bg-gradient-to-br transition-transform duration-700 ease-out group-hover:scale-105 ${book.category === 'Fiksi' ? 'from-blue-600 to-blue-900' : 'from-slate-700 to-slate-900'}`}></div>
                                                        )}
                                                        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/20 via-transparent to-transparent z-10 pointer-events-none"></div>
                                                        <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10 z-10 pointer-events-none"></div>
                                                        <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none z-10">
                                                            <span className="text-[9px] font-black tracking-wider text-white bg-black/40 backdrop-blur-[4px] w-max px-2.5 py-1 rounded-md uppercase border border-white/10 shadow-sm">{book.category}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5 px-1">
                                                        <span className="text-[10px] font-bold text-blue-600 block uppercase tracking-wider">{book.type.split(' & ')[0]}</span>
                                                        <h4 className="font-black text-[#0B3A60] text-sm leading-snug group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">{book.title}</h4>
                                                        <p className="text-xs font-semibold text-slate-400">Tahun {book.year}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={`text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 transition-all duration-700 delay-500 ${isPopularVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                            <p className="text-sm font-semibold text-slate-500">Belum ada koleksi populer untuk jenis ini.</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* SECTION ABOUT DENGAN ANIMASI ON-SCROLL */}
                            <section id="about" ref={aboutRef} className="py-0 scroll-mt-20 grid md:grid-cols-2 gap-12 items-center overflow-hidden">
                                {/* Teks Kiri: Muncul bergeser dari sebelah kiri */}
                                <div className={`space-y-6 transition-all duration-1000 ease-out ${isAboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
                                    <span className="text-xs font-black tracking-widest text-blue-600 uppercase block">ABOUT US</span>
                                    <h2 className="text-3xl font-black text-[#0B3A60]">Jadilah lebih cerdas dengan satu buku setiap hari.</h2>
                                    <div className="space-y-4 text-sm text-slate-500 leading-relaxed">
                                        <p>Pustaka Digital adalah platform perpustakaan digital yang memudahkan Anda meminjam dan membaca buku favorit secara instan langsung melalui browser. Kami hadir untuk membuat akses literasi menjadi lebih praktis dan efisien, memungkinkan Anda menjelajahi ribuan koleksi tanpa perlu menginstal aplikasi tambahan.</p>
                                        <p>Demi kenyamanan bersama, kami menerapkan sistem masa pinjam yang teratur agar koleksi tetap tersedia bagi semua pengguna. Harap diperhatikan bahwa keterlambatan pengembalian buku akan dikenakan denda sesuai ketentuan sebagai bentuk tanggung jawab kita bersama.</p>
                                        <p className="font-semibold text-[#0B3A60]">Literasi dalam satu klik</p>
                                    </div>
                                </div>

                                {/* List Kanan: Muncul berurutan (delay 300ms) bergeser dari sebelah kanan */}
                                <div className="space-y-4 max-w-md mx-auto w-full">
                                    {[
                                        { title: "AKSES FLEKSIBEL", color: "bg-blue-600 text-white" },
                                        { title: "KOLEKSI TANPA BATAS", color: "bg-[#0B3A60] text-white" },
                                        { title: "PEMINJAMAN CEPAT", color: "bg-yellow-400 text-slate-900" },
                                        { title: "KOLEKSI EKSKLUSIF", color: "bg-emerald-600 text-white" }
                                    ].map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className="transition-all duration-1000 ease-out"
                                            style={{ 
                                                opacity: isAboutVisible ? 1 : 0,
                                                transform: isAboutVisible ? `translateX(${idx * 12}px)` : `translateX(${idx * 12 + 150}px)`, 
                                                transitionDelay: `${idx * 300}ms` 
                                            }}
                                        >
                                            <div className="group flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-50 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                                                <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${item.color}`}>
                                                    {idx + 1}
                                                </div>
                                                <span className="text-sm font-black text-[#0B3A60] tracking-wide group-hover:text-blue-600 transition-colors">{item.title}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* TAMPILAN KATEGORI KHUSUS */}
                    {activeTab === 'kategori' && (
                        <div className="animate-fade-in min-h-[70vh]"> 
                            <div className="w-full pb-8 relative z-50">
                                <div className="max-w-4xl mx-auto text-center pt-8 pb-10 px-4">
                                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight animate-fade-up">
                                        Eksplorasi Dunia <span className="text-blue-600">Literasi</span>
                                    </h1>
                                    <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
                                       Temukan ribuan koleksi buku digital, mulai dari fiksi sains hingga teknologi terkini yang siap menemani waktu luangmu.
                                    </p>
                                </div>
                                <div ref={searchBarRef} className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-full py-3 px-6 md:px-8 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                                    <div className="flex items-center flex-1">
                                        <div className="relative">
                                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium whitespace-nowrap focus:outline-none">
                                                Browse Category
                                                <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </button>
                                            {isDropdownOpen && (
                                                <div className="absolute top-full left-0 mt-4 w-72 bg-white border border-slate-100 rounded-xl shadow-xl py-3 z-[999] animate-fade-in">
                                                    {dropdownCategories.map((kategori) => (
                                                        <div key={kategori.id} className="mb-3 last:mb-0">
                                                            <div className="px-5 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">{kategori.title}</div>
                                                            <ul>
                                                                {kategori.items.map((item, index) => (
                                                                    <li key={index}>
                                                                        <button onClick={() => { setKatalogKategori(katalogKategori === item ? 'Semua' : item); setIsDropdownOpen(false); }} className={`w-full text-left px-5 py-2 text-sm transition-colors ${katalogKategori === item ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600 border-l-4 border-transparent'}`}>
                                                                            {item}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-px h-5 bg-slate-300 mx-4 md:mx-6"></div>
                                        <div className="flex items-center gap-3 flex-1 max-w-xl">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Book" className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-300 w-full focus:ring-0" />
                                            {searchQuery && (
                                                <button onClick={() => setSearchQuery('')} className="p-1 rounded-full text-slate-400 hover:text-red-500 transition-colors"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5 max-w-7xl mx-auto px-6">
                                {popularBooks.filter(book => katalogKategori === 'Semua' || book.type === katalogKategori).filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase())).map((book, index) => (
                                  <div 
        key={book.id} 
        onClick={() => window.location.href = route('login')} // Tambahkan baris ini
        className="group flex flex-col cursor-pointer animate-[fadeUp_0.5s_ease-out_both]" 
        style={{ animationDelay: `${index * 40}ms` }}
    >
        <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden transition-all duration-500 ease-out transform group-hover:-translate-y-2 shadow-sm group-hover:shadow-[0_15px_30px_-10px_rgba(11,58,96,0.3)] mb-3 bg-slate-200">
                                            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shine z-20 pointer-events-none"></div>
                                            {book.cover ? (
                                                <img src={book.cover} alt={book.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy" />
                                            ) : (
                                                <div className={`absolute inset-0 bg-gradient-to-br transition-transform duration-700 ease-out group-hover:scale-105 ${book.category === 'Fiksi' ? 'from-blue-600 to-cyan-500' : 'from-[#0B3A60] to-slate-800'}`}></div>
                                            )}
                                            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/30 via-transparent to-transparent z-10 pointer-events-none"></div>
                                            <div className="absolute left-2.5 top-0 bottom-0 w-px bg-white/20 z-10 pointer-events-none"></div>
                                            <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none z-10">
                                                <span className="text-[8px] font-black tracking-wider text-white bg-black/40 backdrop-blur-md w-max px-2 py-0.5 rounded uppercase border border-white/20 shadow-sm">{book.category}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1 px-1">
                                            <span className="text-[9px] font-bold text-cyan-600 block uppercase tracking-wider line-clamp-1">{book.type.split(' & ')[0]}</span>
                                            <h4 className="font-bold text-[#0B3A60] text-xs leading-snug group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 title-book">{book.title}</h4>
                                            <p className="text-[10px] font-semibold text-slate-400">{book.year}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                                    {/* TAMPILAN HALAMAN TENTANG PUSTAKA DIGITAL */}
                    {activeTab === 'tentang' && (
                        <div className="animate-fade-in min-h-[70vh] w-full pb-16">
                            
                            {/* 1. Header Hero Section (Full-width, No Space with Navbar, Elegant, Animated) */}
                            <section className="w-screen relative left-1/2 -translate-x-1/2 bg-[#0B3A60] text-white -mt-28 pt-36 pb-20 md:pb-28 overflow-hidden mb-16 shadow-inner">
                                
                                {/* Dekorasi Latar Belakang yang Halus */}
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
                                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
                                
                                <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center md:flex-row md:items-start gap-12 md:gap-20 relative z-10">
                                    
                                    {/* Bagian Kiri: Judul */}
                                    <div className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left">
                                        <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                                            <div className="h-px w-10 bg-yellow-400"></div>
                                            <span className="text-yellow-400 font-bold tracking-[0.2em] text-xs uppercase">
                                                Tentang Kami
                                            </span>
                                        </div>
                                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight opacity-0 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                                            <strong className="font-black">PUSTAKA</strong><br />
                                            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">DIGITAL</span>
                                        </h2>
                                    </div>

                                    {/* Bagian Kanan: Teks Deskripsi */}
                                    <div className="w-full md:w-7/12 flex flex-col gap-6 text-blue-50/90">
                                        <p className="text-lg md:text-xl leading-relaxed font-medium opacity-0 animate-fade-up" style={{ animationDelay: '0.5s' }}>
                                            Pustaka Digital adalah platform perpustakaan digital yang memudahkan Anda meminjam dan membaca buku favorit secara instan langsung melalui browser. Kami hadir untuk membuat akses literasi menjadi lebih praktis dan efisien, memungkinkan Anda menjelajahi ribuan koleksi tanpa perlu menginstal aplikasi tambahan.
                                        </p>
                                        
                                        {/* Kotak Peringatan Elegan (Glassmorphism Style) */}
                                        <div className="mt-4 p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4 opacity-0 animate-fade-up backdrop-blur-sm hover:bg-white/10 transition-all duration-300" style={{ animationDelay: '0.7s' }}>
                                            <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-yellow-400 text-[#0B3A60] p-2.5 shadow-md shadow-yellow-400/20">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-base leading-relaxed text-yellow-400 font-bold mb-1 tracking-wide">Penting: Tanggung Jawab Bersama</p>
                                                <p className="text-sm leading-relaxed text-blue-100/80">
                                                    Demi kenyamanan bersama, kami menerapkan sistem masa pinjam yang teratur agar koleksi tetap tersedia bagi semua pengguna. Harap diperhatikan bahwa keterlambatan pengembalian buku akan dikenakan denda sesuai ketentuan sebagai bentuk tanggung jawab kita bersama.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </section>

                            {/* 2. Grid Visi & Misi (Card Layout dengan Animasi) */}
                            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-12 px-4 relative z-10">
                                {/* Card Visi */}
                                <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-lg shadow-blue-900/5 border border-slate-100 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 group opacity-0 animate-fade-up" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
                                    <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 group-hover:bg-yellow-400 group-hover:text-white transition-all duration-500 shadow-sm">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-black text-[#0B3A60] mb-4 group-hover:text-yellow-500 transition-colors duration-300">Visi Kami</h3>
                                    <p className="text-slate-500 leading-relaxed text-[15px]">
                                        Menjadi ekosistem literasi digital nomor satu yang membentuk generasi cerdas, kritis, dan berwawasan luas melalui akses ilmu pengetahuan yang inklusif, merata, dan berkelanjutan.
                                    </p>
                                </div>

                                {/* Card Misi */}
                                <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-lg shadow-blue-900/5 border border-slate-100 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 group opacity-0 animate-fade-up" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
                                    <div className="w-16 h-16 bg-blue-50 text-[#0B3A60] rounded-2xl flex items-center justify-center mb-6 group-hover:-rotate-12 group-hover:scale-110 group-hover:bg-[#0B3A60] group-hover:text-white transition-all duration-500 shadow-sm">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-black text-[#0B3A60] mb-4 group-hover:text-blue-600 transition-colors duration-300">Misi Kami</h3>
                                    <ul className="text-slate-500 space-y-4 text-[15px]">
                                        <li className="flex items-start gap-3 group/item">
                                            <div className="bg-emerald-100 p-1 rounded-full mt-0.5 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-colors duration-300">
                                                <svg className="w-4 h-4 text-emerald-600 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Menyediakan koleksi literatur berkualitas yang mudah diakses dari segala perangkat.</span>
                                        </li>
                                        <li className="flex items-start gap-3 group/item">
                                            <div className="bg-emerald-100 p-1 rounded-full mt-0.5 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-colors duration-300">
                                                <svg className="w-4 h-4 text-emerald-600 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Menghadirkan antarmuka pembacaan yang nyaman, estetis, dan ramah pengguna (UI/UX).</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* 3. Bar Statistik / Pencapaian */}
                            <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#0B3A60] via-[#0E4A7A] to-[#0B3A60] rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden relative opacity-0 animate-fade-up" style={{ animationDelay: '1.3s', animationFillMode: 'forwards' }}>
                                <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 pointer-events-none"></div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10 relative z-10">
                                    <div className="px-2 transform hover:scale-110 transition-transform duration-300">
                                        <div className="text-3xl md:text-5xl font-black text-yellow-400 mb-2 tracking-tight drop-shadow-md">
                                            <AnimatedCounter target={50} />
                                        </div>
                                        <div className="text-[10px] md:text-xs font-bold text-blue-200 uppercase tracking-widest">Koleksi Buku</div>
                                    </div>
                                    <div className="px-2 transform hover:scale-110 transition-transform duration-300">
                                        <div className="text-3xl md:text-5xl font-black text-yellow-400 mb-2 tracking-tight drop-shadow-md">
                                            <AnimatedCounter target={120} />
                                        </div>
                                        <div className="text-[10px] md:text-xs font-bold text-blue-200 uppercase tracking-widest">Pembaca Aktif</div>
                                    </div>
                                    <div className="px-2 transform hover:scale-110 transition-transform duration-300">
                                        <div className="text-3xl md:text-5xl font-black text-yellow-400 mb-2 tracking-tight drop-shadow-md">
                                            <AnimatedCounter target={15} />
                                        </div>
                                        <div className="text-[10px] md:text-xs font-bold text-blue-200 uppercase tracking-widest">Kategori</div>
                                    </div>
                                    <div className="px-2 border-l border-white/10 transform hover:scale-110 transition-transform duration-300">
                                        <div className="text-3xl md:text-5xl font-black text-yellow-400 mb-2 tracking-tight drop-shadow-md">
                                            24/7
                                        </div>
                                        <div className="text-[10px] md:text-xs font-bold text-blue-200 uppercase tracking-widest">Akses Platform</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
{/* 2. TAMPILAN PUSAT BANTUAN (SIMPLIFIED & ELEGANT) */}
{activeTab === 'bantuan' && (
    <div className="animate-fade-in min-h-[70vh] w-full pb-16">
        
        {/* 1. Header Hero Section (Full-width, No Space dengan Navbar) */}
        <section className="w-screen relative left-1/2 -translate-x-1/2 bg-[#0B3A60] text-white -mt-28 pt-36 pb-20 md:pb-28 overflow-hidden mb-16 shadow-inner">
            {/* Dekorasi Latar Belakang */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center md:flex-row md:items-start gap-12 md:gap-20 relative z-10">
                {/* Bagian Kiri: Judul */}
                <div className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                        <div className="h-px w-10 bg-yellow-400"></div>
                        <span className="text-yellow-400 font-bold tracking-[0.2em] text-xs uppercase">
                            FAQ & Kontak
                        </span>
                    </div>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight opacity-0 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                        <strong className="font-black">PUSAT</strong><br />
                        <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">BANTUAN</span>
                    </h2>
                </div>

                {/* Bagian Kanan: Penjelasan Singkat */}
                <div className="w-full md:w-7/12 flex flex-col justify-center min-h-[100px]">
                    <p className="text-lg md:text-xl leading-relaxed font-medium text-blue-50/90 opacity-0 animate-fade-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                        Punya kendala seputar akun Pustaka Digital atau aturan peminjaman? Temukan jawaban cepat di bawah ini atau hubungi langsung admin support kami.
                    </p>
                </div>
            </div>
        </section>

        {/* 2. Tata Letak Konten (2 Kolom: FAQ & Kontak Admin) */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-4 relative z-10">
            
            {/* KOLOM KIRI (Lebih Lebar): Daftar Pertanyaan Sering Diajukan (FAQ) */}
            <div className="md:col-span-2 space-y-4">
                <h3 className="text-2xl font-black text-[#0B3A60] mb-6 opacity-0 animate-fade-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                    Pertanyaan yang Sering Diajukan
                </h3>

                {/* FAQ 1 */}
                <details className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                    <summary className="flex items-center justify-between p-6 font-bold text-[#0B3A60] cursor-pointer list-none select-none group-open:bg-slate-50/50 transition-colors">
                        <span>Bagaimana cara meminjam buku di Pustaka Digital?</span>
                        <span className="transition-transform duration-300 group-open:rotate-180">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div className="p-6 pt-0 text-slate-500 leading-relaxed text-sm border-t border-slate-50">
                        Sangat mudah! Pastikan Anda sudah login terlebih dahulu. Cari buku yang Anda inginkan di halaman katalog, klik detail buku, lalu tekan tombol <strong className="text-[#0B3A60]">"Pinjam Buku"</strong>. Buku akan otomatis masuk ke rak digital Anda dan bisa langsung dibaca melalui browser.
                    </div>
                </details>

                {/* FAQ 2 */}
                <details className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                    <summary className="flex items-center justify-between p-6 font-bold text-[#0B3A60] cursor-pointer list-none select-none group-open:bg-slate-50/50 transition-colors">
                        <span>Berapa lama batas waktu peminjaman satu buku?</span>
                        <span className="transition-transform duration-300 group-open:rotate-180">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div className="p-6 pt-0 text-slate-500 leading-relaxed text-sm border-t border-slate-50">
                        Masa peminjaman standar untuk setiap buku adalah <strong className="text-[#0B3A60]">7 hari</strong>. Anda dapat mengembalikannya lebih cepat jika sudah selesai membaca agar kuota peminjaman Anda kosong kembali.
                    </div>
                </details>

                {/* FAQ 3 */}
                <details className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
                    <summary className="flex items-center justify-between p-6 font-bold text-[#0B3A60] cursor-pointer list-none select-none group-open:bg-slate-50/50 transition-colors">
                        <span>Bagaimana aturan denda jika terlambat mengembalikan buku?</span>
                        <span className="transition-transform duration-300 group-open:rotate-180">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div className="p-6 pt-0 text-slate-500 leading-relaxed text-sm border-t border-slate-50">
                        Demi kenyamanan sirkulasi bersama, keterlambatan pengembalian buku akan dikenakan denda administratif sebesar <strong className="text-amber-600">Rp 1.000,- per hari untuk setiap buku</strong>. Akun Anda akan ditangguhkan sementara dari peminjaman baru sampai denda diselesaikan.
                    </div>
                </details>

                {/* FAQ 4 */}
                <details className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: '1.0s', animationFillMode: 'forwards' }}>
                    <summary className="flex items-center justify-between p-6 font-bold text-[#0B3A60] cursor-pointer list-none select-none group-open:bg-slate-50/50 transition-colors">
                        <span>Mengapa saya tidak bisa login ke akun saya?</span>
                        <span className="transition-transform duration-300 group-open:rotate-180">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div className="p-6 pt-0 text-slate-500 leading-relaxed text-sm border-t border-slate-50">
                        Hal ini biasanya terjadi karena salah memasukkan password atau akun Anda belum diaktivasi oleh admin perpustakaan. Jika Anda lupa password, silakan hubungi admin support melalui kontak di sebelah kanan untuk reset akun secara instan.
                    </div>
                </details>
                {/* FAQ 5: Tentang Kebijakan & Privasi */}
<details className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
    <summary className="flex items-center justify-between p-6 font-bold text-[#0B3A60] cursor-pointer list-none select-none group-open:bg-slate-50/50 transition-colors">
        <span>Di mana saya bisa membaca Syarat, Ketentuan, dan Kebijakan Privasi platform?</span>
        <span className="transition-transform duration-300 group-open:rotate-180">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
        </span>
    </summary>
    <div className="p-6 pt-0 text-slate-500 leading-relaxed text-sm border-t border-slate-50">
        Kami sangat menjaga keamanan data dan kenyamanan sirkulasi Anda. Dokumen legalitas lengkap dapat Anda akses secara transparan melalui tautan <a href="/syarat-ketentuan" className="text-blue-600 font-bold hover:underline">Syarat & Ketentuan Pengguna</a> serta <a href="/kebijakan-privasi" className="text-blue-600 font-bold hover:underline">Kebijakan Privasi</a> yang tersedia di bagian bawah (footer) website ini.
    </div>
</details>
            </div>

            {/* KOLOM KANAN: Informasi Kontak Admin (Sleek & Clean) */}
            <div className="space-y-6">
                <h3 className="text-2xl font-black text-[#0B3A60] opacity-0 animate-fade-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                    Kontak Admin
                </h3>

                {/* Card Nomor Telepon / Hotline Bantuan (Ikon Elemen Telepon Mewah) */}
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 flex flex-col gap-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group opacity-0 animate-fade-up" style={{ animationDelay: '1.0s', animationFillMode: 'forwards' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#0B3A60] group-hover:text-white transition-all duration-300 shadow-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-black text-[#0B3A60] text-base">Hotline Support</h4>
                            <p className="text-slate-400 text-xs">Hubungi via Pesan Teknis / Telepon.</p>
                        </div>
                    </div>
                    {/* Kotak Nomor Telepon */}
                    <div className="w-full bg-slate-50 border border-slate-200 text-[#0B3A60] text-center py-3.5 rounded-xl font-black text-lg tracking-wider">
                        +62 812-3456-7890
                    </div>
                </div>

                {/* Card Alamat Email */}
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 flex flex-col gap-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group opacity-0 animate-fade-up" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#0B3A60] group-hover:text-white transition-all duration-300 shadow-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-black text-[#0B3A60] text-base">Email Resmi</h4>
                            <p className="text-slate-400 text-xs">Untuk kendala administratif resmi.</p>
                        </div>
                    </div>
                    {/* Kotak Email */}
                    <div className="w-full bg-slate-50 border border-slate-200 text-[#0B3A60] text-center py-3.5 rounded-xl font-bold text-sm tracking-wide">
                        support@pustakadigital.com
                    </div>
                </div>

            </div>
        </div>

    </div>
)}
{/* 3. TAMPILAN SYARAT & KETENTUAN (MODERN GRID LAYOUT) */}
{activeTab === 'syarat' && (
    <div className="animate-fade-in min-h-[70vh] w-full pb-20">
        
        {/* 1. Hero Header Section */}
        <section className="w-screen relative left-1/2 -translate-x-1/2 bg-[#0B3A60] text-white -mt-28 pt-36 pb-20 md:pb-24 overflow-hidden mb-16 shadow-inner">
            {/* Efek Bola Cahaya Latar Belakang */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="max-w-6xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                <span className="text-yellow-400 font-bold tracking-[0.2em] text-xs uppercase block mb-4 opacity-0 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                    Regulasi & Hukum
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black opacity-0 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                    SYARAT & KETENTUAN
                </h2>
                <p className="text-blue-100/80 mt-6 text-base md:text-lg max-w-2xl font-medium opacity-0 animate-fade-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                    Panduan resmi penggunaan layanan, sirkulasi peminjaman buku digital, hak cipta, serta sanksi di platform Pustaka Digital.
                </p>
                <div className="mt-8 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-blue-200/80 font-semibold backdrop-blur-sm opacity-0 animate-fade-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                    Terakhir Diperbarui: Mei 2026
                </div>
            </div>
        </section>

        {/* 2. Konten Utama Dokumen (Grid Layout 2 Kolom) */}
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            
            {/* Card 1: Registrasi */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-lg shadow-blue-900/5 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 opacity-0 animate-fade-up" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                <div className="absolute -top-4 -right-2 text-[140px] font-black text-slate-50 group-hover:text-blue-50/50 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none z-0">1</div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <h4 className="font-black text-[#0B3A60] text-xl mb-3">Registrasi & Akun Pengguna</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Platform ini terbuka untuk publik secara terbatas. Anda wajib mendaftarkan akun menggunakan data identitas yang valid. Akun Anda adalah tanggung jawab pribadi; pembagian kredensial login kepada pihak luar dilarang keras demi keamanan data.
                    </p>
                </div>
            </div>

            {/* Card 2: Sirkulasi */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-lg shadow-blue-900/5 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 opacity-0 animate-fade-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                <div className="absolute -top-4 -right-2 text-[140px] font-black text-slate-50 group-hover:text-blue-50/50 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none z-0">2</div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h4 className="font-black text-[#0B3A60] text-xl mb-3">Sirkulasi & Masa Peminjaman</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Setiap akun memiliki batasan kuota peminjaman. Batas waktu membaca untuk setiap judul buku adalah maksimal 7 hari kalender. Sistem akan melakukan penarikan buku secara otomatis dari rak digital Anda saat durasi peminjaman habis.
                    </p>
                </div>
            </div>

            {/* Card 3: Denda */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-lg shadow-blue-900/5 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 opacity-0 animate-fade-up" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
                <div className="absolute -top-4 -right-2 text-[140px] font-black text-slate-50 group-hover:text-amber-50 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none z-0">3</div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 border border-amber-100 shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h4 className="font-black text-[#0B3A60] text-xl mb-3">Aturan Denda Administratif</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Keterlambatan sirkulasi akibat kelalaian pengembalian mandiri akan dikenakan denda administratif sebesar <strong className="text-amber-600">Rp 1.000,- per hari/buku</strong>. Akses pinjam buku baru akan dibekukan sementara hingga denda diselesaikan.
                    </p>
                </div>
            </div>

            {/* Card 4: Hak Cipta */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-lg shadow-blue-900/5 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 opacity-0 animate-fade-up" style={{ animationDelay: '1.0s', animationFillMode: 'forwards' }}>
                <div className="absolute -top-4 -right-2 text-[140px] font-black text-slate-50 group-hover:text-blue-50/50 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none z-0">4</div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <h4 className="font-black text-[#0B3A60] text-xl mb-3">Perlindungan Hak Cipta</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Seluruh koleksi di platform ini dilindungi oleh Undang-Undang Hak Cipta. Pengguna dilarang menyalin, menggandakan, melakukan <i>screen capture</i> massal, atau mendistribusikan ulang file PDF di luar dari sistem pembacaan (*viewer*) resmi kami.
                    </p>
                </div>
            </div>

            {/* Card 5: Sanksi */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-lg shadow-blue-900/5 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 opacity-0 animate-fade-up" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
                <div className="absolute -top-4 -right-2 text-[140px] font-black text-slate-50 group-hover:text-red-50 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none z-0">5</div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 border border-red-100 shadow-sm group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                    </div>
                    <h4 className="font-black text-[#0B3A60] text-xl mb-3">Sanksi Penyalahgunaan</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Kami berhak melakukan investigasi dan pemblokiran akun secara permanen tanpa pemberitahuan jika pengguna terbukti membuat akun palsu, mengeksploitasi celah keamanan (*bug*), atau melanggar hak cipta penerbit buku.
                    </p>
                </div>
            </div>

            {/* Card 6: Disclaimer */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-lg shadow-blue-900/5 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 opacity-0 animate-fade-up" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
                <div className="absolute -top-4 -right-2 text-[140px] font-black text-slate-50 group-hover:text-slate-100 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none z-0">6</div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6 border border-slate-200 shadow-sm group-hover:bg-slate-600 group-hover:text-white transition-colors duration-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h4 className="font-black text-[#0B3A60] text-xl mb-3">Batasan Tanggung Jawab</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Kami tidak bertanggung jawab atas kerugian material/non-material akibat pemeliharaan server (*maintenance*). Seluruh keputusan administratif denda dan pembekuan akun mutlak berada di tangan pengelola perpustakaan.
                    </p>
                </div>
            </div>

        </div>
    </div>
)}

{/* 4. TAMPILAN KEBIJAKAN PRIVASI (MODERN GRID LAYOUT & ANIMATED) */}
{activeTab === 'privasi' && (
    <div className="animate-[fadeIn_0.5s_ease-out_both] min-h-[70vh] w-full pb-20">
        
        {/* 1. Hero Header Section */}
        <section className="w-screen relative left-1/2 -translate-x-1/2 bg-[#0B3A60] text-white -mt-28 pt-36 pb-20 md:pb-24 overflow-hidden mb-16 shadow-inner">
            {/* Efek Bola Cahaya */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                {/* Judul Hero (Muncul duluan) */}
                <span className="text-emerald-400 font-bold tracking-[0.2em] text-xs uppercase block mb-4 opacity-0 animate-[fadeUp_0.6s_ease-out_both]" style={{ animationDelay: '100ms' }}>
                    Privasi & Keamanan Data
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black opacity-0 animate-[fadeUp_0.6s_ease-out_both]" style={{ animationDelay: '250ms' }}>
                    KEBIJAKAN PRIVASI
                </h2>
                <p className="text-blue-100/80 mt-6 text-base md:text-lg max-w-2xl font-medium opacity-0 animate-[fadeUp_0.6s_ease-out_both]" style={{ animationDelay: '400ms' }}>
                    Transparansi penuh mengenai bagaimana kami mengumpulkan, melindungi, dan mengelola data pribadi Anda di ekosistem Pustaka Digital.
                </p>
                <div className="mt-8 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-blue-200/80 font-semibold backdrop-blur-sm opacity-0 animate-[fadeUp_0.6s_ease-out_both]" style={{ animationDelay: '500ms' }}>
                    Terakhir Diperbarui: Mei 2026
                </div>
            </div>
        </section>

       {/* 2. Konten Utama (Grid Layout 2 Kolom dengan Efek Muncul dari Samping Bergantian) */}
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 overflow-hidden">

            {/* Card 1: Data (Muncul dari Kiri) */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-lg shadow-blue-900/5 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 opacity-0 animate-[fadeLeft_0.6s_ease-out_both]" style={{ animationDelay: '600ms' }}>
                <div className="absolute -top-4 -right-2 text-[140px] font-black text-slate-50 group-hover:text-emerald-50/50 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none z-0">1</div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                    </div>
                    <h4 className="font-black text-[#0B3A60] text-xl mb-3">Pengumpulan Data Pribadi</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Kami mengumpulkan informasi identitas dasar seperti nama lengkap, alamat email aktif, dan status keanggotaan saat Anda mendaftar. Data ini murni digunakan untuk keperluan sirkulasi peminjaman dan identifikasi akun yang sah.
                    </p>
                </div>
            </div>

            {/* Card 2: Keamanan (Muncul dari Kanan) */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-lg shadow-blue-900/5 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 opacity-0 animate-[fadeRight_0.6s_ease-out_both]" style={{ animationDelay: '700ms' }}>
                <div className="absolute -top-4 -right-2 text-[140px] font-black text-slate-50 group-hover:text-blue-50/50 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none z-0">2</div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h4 className="font-black text-[#0B3A60] text-xl mb-3">Enkripsi & Keamanan Server</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Password dan data sensitif Anda dienkripsi menggunakan standar keamanan industri terbaru. Server kami dilindungi oleh firewall berlapis untuk mencegah akses ilegal atau kebocoran data (*data breach*).
                    </p>
                </div>
            </div>

            {/* Card 3: Cookies (Muncul dari Kiri) */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-lg shadow-blue-900/5 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 opacity-0 animate-[fadeLeft_0.6s_ease-out_both]" style={{ animationDelay: '800ms' }}>
                <div className="absolute -top-4 -right-2 text-[140px] font-black text-slate-50 group-hover:text-amber-50 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none z-0">3</div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 border border-amber-100 shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                    </div>
                    <h4 className="font-black text-[#0B3A60] text-xl mb-3">Penggunaan Cookies</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Kami menggunakan *cookies* sesi secara minimalis hanya untuk mempertahankan status *login* Anda agar tidak perlu memasukkan password berulang kali. Kami **tidak melacak** riwayat internet Anda di luar web kami.
                    </p>
                </div>
            </div>

            {/* Card 4: Riwayat (Muncul dari Kanan) */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-lg shadow-blue-900/5 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 opacity-0 animate-[fadeRight_0.6s_ease-out_both]" style={{ animationDelay: '900ms' }}>
                <div className="absolute -top-4 -right-2 text-[140px] font-black text-slate-50 group-hover:text-blue-50/50 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none z-0">4</div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <h4 className="font-black text-[#0B3A60] text-xl mb-3">Privasi Riwayat Membaca</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Log aktivitas membaca dan riwayat peminjaman buku Anda dikumpulkan semata-mata untuk sistem rak digital pribadi Anda dan statistik agregat anonim perpustakaan, bukan untuk dipublikasikan ke publik.
                    </p>
                </div>
            </div>

            {/* Card 5: Pihak Ketiga (Muncul dari Kiri) */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-lg shadow-blue-900/5 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 opacity-0 animate-[fadeLeft_0.6s_ease-out_both]" style={{ animationDelay: '1000ms' }}>
                <div className="absolute -top-4 -right-2 text-[140px] font-black text-slate-50 group-hover:text-red-50 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none z-0">5</div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 border border-red-100 shadow-sm group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                    </div>
                    <h4 className="font-black text-[#0B3A60] text-xl mb-3">Tidak Ada Penjualan Data</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Kami berjanji dan menjamin secara hukum bahwa data identitas dan kontak Anda **tidak akan pernah dijual**, disewakan, atau dibagikan kepada pihak ketiga, agensi periklanan, atau entitas komersial mana pun.
                    </p>
                </div>
            </div>

            {/* Card 6: Hapus Data (Muncul dari Kanan) */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-lg shadow-blue-900/5 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 opacity-0 animate-[fadeRight_0.6s_ease-out_both]" style={{ animationDelay: '1100ms' }}>
                <div className="absolute -top-4 -right-2 text-[140px] font-black text-slate-50 group-hover:text-slate-100 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none z-0">6</div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6 border border-slate-200 shadow-sm group-hover:bg-slate-600 group-hover:text-white transition-colors duration-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </div>
                    <h4 className="font-black text-[#0B3A60] text-xl mb-3">Hak Penghapusan Akun</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Anda memiliki hak penuh untuk meminta penghapusan akun beserta seluruh jejak data pribadi Anda dari server kami. Silakan hubungi admin *support* jika Anda ingin melakukan penutupan akun permanen.
                    </p>
                </div>
            </div>
            
        </div>
    </div>
)}

                </main>

             <footer className="bg-[#0B3A60] pt-16 pb-8 border-t border-white/10 mt-10 relative z-10">
    <div className="container mx-auto px-6 max-w-6xl">
        {/* GRID UTAMA FOOTER (4 Kolom agar tidak kosong) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Kolom 1: Tentang Platform */}
            <div className="md:col-span-1">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 mb-5">
                    PustakaDigital
                </h3>
                <p className="text-sm text-blue-200/70 leading-relaxed">
                    Hadir untuk memberikan akses membaca yang lebih modern dan menghubungkan Anda dengan komunitas literasi terbaik di seluruh Indonesia.
                </p>
            </div>
            
            {/* Kolom 2: Bantuan & Legalitas (Satu-satunya yang bisa diklik) */}
            <div>
                <h4 className="text-white font-bold mb-5 text-sm tracking-widest uppercase relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-6 after:h-0.5 after:bg-yellow-400 after:rounded-full">
                    Layanan
                </h4>
                <ul className="text-sm text-blue-200/80 space-y-3">
                    {['Pusat Bantuan', 'Kebijakan Privasi', 'Syarat & Ketentuan'].map((item, index) => {
                        const tabKeys = ['bantuan', 'privasi', 'syarat'];
                        return (
                            <li key={index}>
                                <button 
                                    onClick={() => {
                                        setActiveTab(tabKeys[index]);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }} 
                                    className="text-left hover:text-yellow-400 transition-colors duration-300"
                                >
                                    {item}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Kolom 3: Lokasi & Operasional (BARU: Teks statis untuk mengisi kekosongan) */}
            <div>
                <h4 className="text-white font-bold mb-5 text-sm tracking-widest uppercase relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-6 after:h-0.5 after:bg-yellow-400 after:rounded-full">
                    Kantor Pusat
                </h4>
                <div className="text-sm text-blue-200/70 space-y-3">
                    <p className="leading-relaxed">
                        Gedung Literasi Bangsa Lt. 4<br />
                        Jl. Sudirman No. 123<br />
                        Jakarta Selatan, 12190
                    </p>
                    <div className="pt-3 border-t border-white/5 mt-3">
                        <span className="block text-yellow-400 font-medium mb-1 text-xs">Jam Operasional:</span>
                        <p>Senin - Jumat: 08.00 - 17.00</p>
                    </div>
                </div>
            </div>
            
            {/* Kolom 4: Hubungi Kami (Statis & Ikon Diperkecil) */}
            <div>
                <h4 className="text-white font-bold mb-5 text-sm tracking-widest uppercase relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-6 after:h-0.5 after:bg-yellow-400 after:rounded-full">
                    Hubungi Kami
                </h4>
                <div className="flex flex-col gap-3">
                    
                    {/* Instagram */}
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-yellow-400">
                            <svg fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                        </div>
                        <span className="text-[13px] font-medium text-blue-200/80">
                            @pustakadigital
                        </span>
                    </div>
                    
                    {/* X / Twitter */}
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-yellow-400">
                            <svg fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </div>
                        <span className="text-[13px] font-medium text-blue-200/80">
                            @pustakadigital
                        </span>
                    </div>
                    
                    {/* Email */}
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-yellow-400">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </div>
                        <span className="text-[13px] font-medium text-blue-200/80">
                            support@pustakadigital.com
                        </span>
                    </div>
                    
                </div>
            </div>

        </div>
        
        {/* BARIS TERBAWAH: HAK CIPTA */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
            <p className="text-blue-200/50 text-xs font-medium">
                &copy; {new Date().getFullYear()} PustakaDigital. Hak Cipta Dilindungi.
            </p>
            <p className="text-blue-200/40 text-[10px] font-semibold tracking-widest uppercase">
                Literasi Dalam Satu Klik.
            </p>
        </div>
    </div>
</footer>

                {selectedCategory !== null && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-[fadeIn_0.2s_ease-out]">
                            <div className="p-6 bg-[#0B3A60] text-white flex justify-between items-center">
                                <span className="text-xs font-black tracking-widest text-yellow-400 uppercase">Katalog Pustaka</span>
                                <button onClick={() => setSelectedCategory(null)} className="text-white/80 hover:text-yellow-400 p-1 rounded-lg transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                            </div>
                            <div className="p-8 space-y-5 text-center">
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider px-3 py-1 bg-blue-50 rounded-full">Kategori: {selectedCategory.title}</span>
                                <h2 className="text-2xl font-black text-[#0B3A60] leading-snug mt-2">{selectedCategory.currentSub}</h2>
                                <p className="text-xs text-slate-400 leading-relaxed">Menampilkan arsip buku, modul materi, serta rekomendasi literatur pilihan terbaik untuk topik ini.</p>
                                <div className="pt-4"><button className="w-full bg-[#0B3A60] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md text-sm tracking-wide">Buka Rak Buku Digital</button></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                @keyframes fadeLeft { 
    from { opacity: 0; transform: translateX(-50px); } 
    to { opacity: 1; transform: translateX(0); } 
}

@keyframes fadeRight { 
    from { opacity: 0; transform: translateX(50px); } 
    to { opacity: 1; transform: translateX(0); } 
}
            `}</style>
        </>
    );
}