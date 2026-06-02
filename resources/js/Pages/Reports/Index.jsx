import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ auth, peminjamans, stats, bukuPopuler, filter, lastUpdated }) {
    const [startDate, setStartDate] = useState(filter.start_date || '');
    const [endDate, setEndDate] = useState(filter.end_date || '');
    const [search, setSearch] = useState(filter.search || '');

    // --- STATE UNTUK MODAL EXPORT ---
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [exportType, setExportType] = useState('semua'); 
    const [exportFormat, setExportFormat] = useState('pdf');
    const [statusFilter, setStatusFilter] = useState('semua');

    // --- DAFTAR OPSI EXPORT DENGAN ICON SVG ---
    const exportOptions = [
        { id: 'semua', label: 'Semua Transaksi & Denda', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
        { id: 'peminjaman', label: 'Data Peminjaman', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
        { id: 'denda', label: 'Data Denda', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { id: 'anggota', label: 'Data Anggota', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
        { id: 'buku', label: 'Data Koleksi Buku', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /> },
        { id: 'aktif', label: 'Peminjaman Aktif', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { id: 'populer', label: 'Buku Terpopuler', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> },
        { id: 'statistik', label: 'Ringkasan Statistik', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isExportModalOpen) {
                router.reload({
                    only: ['peminjamans', 'stats', 'bukuPopuler', 'lastUpdated'], 
                    preserveState: true,  
                    preserveScroll: true, 
                });
            }
        }, 10000); 

        return () => clearInterval(interval);
    }, [isExportModalOpen]); 

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('reports.index'), { start_date: startDate, end_date: endDate, search: search }, { preserveState: true });
    };

    const handleDownload = () => {
        try {
            // 👇 UBAH BAGIAN INI: Sesuaikan dengan nama rute di web.php
            const routeName = exportFormat === 'pdf' ? 'reports.pdf' : 'reports.excel';
            
            const url = route(routeName, {
                start_date: startDate,
                end_date: endDate,
                search: search,
                type: exportType 
            });
            
            // 👇 Gunakan window.location.href agar langsung terdownload
            window.location.href = url;
            setIsExportModalOpen(false); 

        } catch (error) {
            console.error("Ziggy Error:", error);
            alert("Gagal mendownload! Cek console browser.");
        }
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    const totalStatus = stats.dikembalikan + stats.aktif + stats.terlambat;
    const pctDikembalikan = totalStatus > 0 ? (stats.dikembalikan / totalStatus) * 100 : 0;
    const pctAktif = totalStatus > 0 ? (stats.aktif / totalStatus) * 100 : 0;
    const pctTerlambat = totalStatus > 0 ? (stats.terlambat / totalStatus) * 100 : 0;

    // --- 1. OLAH SEMUA DATA BUKU ---
    const allBookDetails = peminjamans.flatMap((transaksi) => {
        const details = Array.isArray(transaksi.detail_peminjaman) 
            ? transaksi.detail_peminjaman 
            : (transaksi.detail_peminjaman ? [transaksi.detail_peminjaman] : []);

        return details.map(detail => {
            // 👇 Gemy menyesuaikan status langsung dari buku (detail)
            // Cek database kamu, pastikan field-nya 'status' atau sesuaikan (misal: detail.status_buku)
            const statusBuku = detail.status || transaksi.status_peminjaman; 
            const dendaBuku = detail.denda ? parseFloat(detail.denda.jumlah_denda) : 0;
            return { transaksi, detail, statusBuku, dendaBuku };
        });
    });

    // --- 2. HITUNG STATISTIK REAL-TIME PER BUKU ---
    // Sekarang angkanya dihitung langsung dari buku, bukan bawaan stats backend
    const hitungTotalBuku = allBookDetails.length;
    
    // Gemy tambahkan 'dipinjam' dan 'aktif' untuk jaga-jaga format teks di databasemu
    const hitungAktif = allBookDetails.filter(item => 
        item.statusBuku === 'dipinjam' || item.statusBuku === 'menunggu_pengambilan' || item.statusBuku === 'aktif'
    ).length;
    
    const hitungDikembalikan = allBookDetails.filter(item => item.statusBuku === 'dikembalikan').length;
    const hitungTerlambat = allBookDetails.filter(item => item.statusBuku === 'terlambat').length;
    const hitungTotalDenda = allBookDetails.reduce((sum, item) => sum + item.dendaBuku, 0);

    // --- 3. FILTER UNTUK TABEL (SESUAI KOTAK YANG DIPENCET) ---
    const displayedBooks = allBookDetails.filter(item => {
        if (statusFilter === 'semua') return true;
        if (statusFilter === 'aktif') return item.statusBuku === 'dipinjam' || item.statusBuku === 'menunggu_pengambilan' || item.statusBuku === 'aktif';
        if (statusFilter === 'dikembalikan') return item.statusBuku === 'dikembalikan';
        if (statusFilter === 'terlambat') return item.statusBuku === 'terlambat';
        if (statusFilter === 'berdenda') return item.dendaBuku > 0;
        return true;
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Laporan</h2>}
        >
            <Head title="Laporan" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* --- TOOLBAR FILTER & TOMBOL EXPORT --- */}
                    <div className="p-4 bg-white shadow sm:rounded-xl flex flex-col lg:flex-row justify-between items-center gap-4 border-l-4 border-indigo-500">
                        
                        <form onSubmit={handleFilter} className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-md border-gray-300 text-sm focus:ring-indigo-500 w-full sm:w-auto" />
                                </div>
                                <span className="text-gray-400 hidden md:block mt-2">-</span>
                                <div className="flex items-center gap-2">
                                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-md border-gray-300 text-sm focus:ring-indigo-500 w-full sm:w-auto" />
                                </div>
                            </div>

                            <div className="relative w-full md:w-56">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari peminjam..." className="pl-9 block w-full rounded-md border-gray-300 text-sm focus:ring-indigo-500" />
                            </div>

                            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-semibold shadow-sm w-full md:w-auto flex items-center justify-center gap-2 transition hover:-translate-y-0.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                Filter
                            </button>
                        </form>

                        <div className="hidden lg:block h-8 border-l border-gray-200"></div>

                        <div className="flex w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
                            <button 
                                onClick={() => setIsExportModalOpen(true)}
                                className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-5 py-2 rounded-md hover:bg-emerald-100 text-sm font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm w-full lg:w-auto hover:-translate-y-0.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export Laporan
                            </button>
                        </div>
                    </div>

                    {/* --- RINGKASAN PERIODE & GRAFIK MINI --- */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Periode Laporan</p>
                            <h3 className="text-lg font-bold text-gray-800">
                                {new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </h3>
                        </div>
                        <div className="w-full md:w-1/3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1 font-semibold">
                                <span className="flex items-center gap-1">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Live Data
                                </span>
                                <span>{totalStatus} Transaksi</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 flex overflow-hidden shadow-inner">
                                <div style={{ width: `${pctDikembalikan}%` }} className="bg-emerald-500 transition-all duration-500" title="Dikembalikan"></div>
                                <div style={{ width: `${pctAktif}%` }} className="bg-amber-400 transition-all duration-500" title="Aktif"></div>
                                <div style={{ width: `${pctTerlambat}%` }} className="bg-red-500 transition-all duration-500" title="Terlambat"></div>
                            </div>
                            <div className="flex justify-between text-[10px] mt-1 text-gray-400 font-medium">
                                <span className="text-emerald-600">Dikembalikan</span>
                                <span className="text-amber-500">Aktif</span>
                                <span className="text-red-500">Terlambat</span>
                            </div>
                        </div>
                    </div>

                  {/* --- 5 KARTU STATISTIK (SEKARANG MENGHITUNG BUKU SECARA REAL-TIME) --- */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        <div 
                            onClick={() => setStatusFilter('semua')}
                            className={`cursor-pointer p-4 rounded-xl shadow-sm flex items-center justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 bg-blue-50 border ${statusFilter === 'semua' ? 'ring-2 ring-blue-500 border-blue-500' : 'border-blue-100'}`}
                        >
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Total Buku</p>
                                <p className="text-2xl font-extrabold text-gray-900 mt-1">{hitungTotalBuku}</p>
                            </div>
                            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </div>
                        </div>

                        <div 
                            onClick={() => setStatusFilter('aktif')}
                            className={`cursor-pointer p-4 rounded-xl shadow-sm flex items-center justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 bg-amber-50 border ${statusFilter === 'aktif' ? 'ring-2 ring-amber-500 border-amber-500' : 'border-amber-100'}`}
                        >
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Aktif (Pinjam)</p>
                                <p className="text-2xl font-extrabold text-gray-900 mt-1">{hitungAktif}</p>
                            </div>
                            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>

                        <div 
                            onClick={() => setStatusFilter('dikembalikan')}
                            className={`cursor-pointer p-4 rounded-xl shadow-sm flex items-center justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 bg-emerald-50 border ${statusFilter === 'dikembalikan' ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-emerald-100'}`}
                        >
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Dikembalikan</p>
                                <p className="text-2xl font-extrabold text-gray-900 mt-1">{hitungDikembalikan}</p>
                            </div>
                            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                        </div>

                        <div 
                            onClick={() => setStatusFilter('terlambat')}
                            className={`cursor-pointer p-4 rounded-xl shadow-sm flex items-center justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 bg-red-50 border ${statusFilter === 'terlambat' ? 'ring-2 ring-red-500 border-red-500' : 'border-red-100'}`}
                        >
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-red-700">Terlambat</p>
                                <p className="text-2xl font-extrabold text-gray-900 mt-1">{hitungTerlambat}</p>
                            </div>
                            <div className="p-2.5 bg-red-100 text-red-700 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                        </div>

                        <div 
                            onClick={() => setStatusFilter('berdenda')}
                            className={`cursor-pointer p-4 rounded-xl shadow-sm flex items-center justify-between lg:col-span-1 col-span-2 hover:-translate-y-1 hover:shadow-md transition-all duration-300 bg-rose-50 border ${statusFilter === 'berdenda' ? 'ring-2 ring-rose-500 border-rose-500' : 'border-rose-100'}`}
                        >
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Total Denda</p>
                                <p className="text-2xl font-extrabold text-gray-900 mt-1">{formatRupiah(hitungTotalDenda)}</p>
                            </div>
                            <div className="p-2.5 bg-rose-100 text-rose-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* --- TABEL UTAMA --- */}
                        <div className="lg:col-span-3 bg-white shadow sm:rounded-xl overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 gap-4">
                                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    Detail Transaksi
                                </h3>
                                <div className="flex items-center gap-4 text-[11px] text-gray-500 font-medium">
                                    <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> Total Data: {peminjamans.length}</span>
                                    <span className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-md border border-green-100"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Terakhir: {lastUpdated}</span>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">Peminjam</th>
                                            <th className="px-6 py-4 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">Tgl Pinjam</th>
                                            <th className="px-6 py-4 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
                                            <th className="px-6 py-4 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">Denda</th>
                                        </tr>
                                    </thead>
                                   <tbody className="bg-white divide-y divide-gray-100">
                                        {displayedBooks.length > 0 ? (
                                            displayedBooks.map((item, index) => {
                                                const { transaksi, detail, statusBuku, dendaBuku } = item;
                                                
                                                let badgeColor = "bg-gray-50 text-gray-700 border-gray-200";
                                                let Icon = null;
                                                
                                                if (statusBuku === 'dikembalikan') {
                                                    badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                                                    Icon = <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
                                                } else if (statusBuku === 'terlambat') {
                                                    badgeColor = "bg-red-50 text-red-700 border-red-200";
                                                    Icon = <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
                                                } else {
                                                    badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
                                                    Icon = <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
                                                }

                                                return (
                                                    <tr key={`${transaksi.id}-${detail.id || index}`} className="hover:bg-gray-50/80 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="font-medium text-gray-900">{transaksi.user ? transaksi.user.name : 'User Dihapus'}</div>
                                                            <div className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                                                {detail.buku ? detail.buku.judul : 'Buku Tidak Diketahui'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                            {transaksi.tgl_peminjaman ? new Date(transaksi.tgl_peminjaman).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}) : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2.5 py-1 inline-flex items-center text-xs font-bold rounded-full border ${badgeColor}`}>
                                                                {Icon}
                                                                {statusBuku ? statusBuku.replace(/_/g, ' ').toUpperCase() : '-'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                            {dendaBuku > 0 ? (
                                                                <span className="text-red-600">{formatRupiah(dendaBuku)}</span>
                                                            ) : (
                                                                <span className="text-gray-300">-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="4">
                                                    <div className="py-16 flex flex-col justify-center items-center text-center">
                                                        <div className="bg-gray-50 p-4 rounded-full mb-3">
                                                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                                        </div>
                                                        <h4 className="text-gray-900 font-semibold text-lg">Data Kosong</h4>
                                                        <p className="text-gray-400 text-sm mt-1 max-w-sm">Tidak ada buku di kategori ini pada rentang waktu terpilih.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* --- SIDEBAR: RANKING BUKU TERPOPULER --- */}
                        <div className="lg:col-span-1 bg-white shadow sm:rounded-xl p-5 border-t-4 border-amber-400 self-start">
                            <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                Buku Terpopuler
                            </h3>
                            <div className="space-y-4">
                                {bukuPopuler.length > 0 ? (
                                    bukuPopuler.map((buku, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-600' : (index === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-500')}`}>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800 line-clamp-1">{buku.judul}</p>
                                                <p className="text-xs text-gray-500">{buku.jumlah}x dipinjam</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-center text-gray-400 py-4">Belum ada statistik buku.</p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ========================================= */}
            {/* MODAL POPUP EXPORT COMPACT (DIPERKECIL) */}
            {/* ========================================= */}
            {isExportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 transition-opacity">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all">
                        
                        {/* Header Modal */}
                        <div className="px-5 py-3.5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Menu Export Laporan
                            </h3>
                            <button onClick={() => setIsExportModalOpen(false)} className="text-gray-400 hover:text-red-500 bg-white border border-gray-200 hover:bg-red-50 p-1 rounded-full transition shadow-sm">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        {/* Body Modal */}
                        <div className="p-5">
                            
                            {/* Form 1: Pilih Jenis Data */}
                            <div className="mb-5">
                                <label className="block text-xs font-bold text-gray-700 mb-2">1. Pilih Data yang Ingin Di-Export</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {exportOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setExportType(opt.id)}
                                            className={`flex items-center gap-2.5 p-2.5 border rounded-lg text-left transition-all ${
                                                exportType === opt.id 
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-500' 
                                                : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className={`p-1.5 rounded-md ${exportType === opt.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    {opt.icon}
                                                </svg>
                                            </div>
                                            <span className="text-xs font-semibold leading-tight">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Form 2: Pilih Format File */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">2. Pilih Format File</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setExportFormat('pdf')}
                                        className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg border-2 transition-all ${
                                            exportFormat === 'pdf' 
                                            ? 'bg-red-50 border-red-500 text-red-700 shadow-sm' 
                                            : 'border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    >
                                        <svg className={`w-7 h-7 ${exportFormat === 'pdf' ? 'text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-bold text-xs">Dokumen PDF</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setExportFormat('excel')}
                                        className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg border-2 transition-all ${
                                            exportFormat === 'excel' 
                                            ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' 
                                            : 'border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    >
                                        <svg className={`w-7 h-7 ${exportFormat === 'excel' ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-bold text-xs">File Excel</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                        
                        {/* Footer Modal (Tombol Aksi) */}
                        <div className="px-5 py-3 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-2">
                            <button 
                                onClick={() => setIsExportModalOpen(false)} 
                                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition shadow-sm"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleDownload} 
                                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition shadow-md flex items-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Mulai Download
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}