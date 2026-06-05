import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function IndexMember({ bukus, filters, categories, borrowedBookIds = [] }) {
    const [selectedBukus, setSelectedBukus] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectionError, setSelectionError] = useState(null);
    
    // STATE BARU: Untuk menyimpan data buku yang sedang diklik (ditampilkan di Pop-up)
    const [detailBuku, setDetailBuku] = useState(null);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        buku_ids: [],
    });

    const handleToggleSelect = (buku) => {
        setSelectionError(null);
        if (selectedBukus.some((b) => b.id === buku.id)) {
            setSelectedBukus(selectedBukus.filter((b) => b.id !== buku.id));
        } else {
            if (selectedBukus.length >= 5) {
                setSelectionError('Maksimal 5 buku dalam sekali peminjaman.');
                setTimeout(() => setSelectionError(null), 4000);
                return;
            }
            setSelectedBukus([...selectedBukus, buku]);
        }
    };

    const handleCheckout = () => {
        clearErrors();
        setData('buku_ids', selectedBukus.map(b => b.id));
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/peminjamans-buat', {
            onSuccess: () => {
                setShowModal(false);
                setSelectedBukus([]);
                setData({ buku_ids: [] });
            }
        });
    };

    const handleFilterKategori = (kategori) => {
        router.get('/daftar-buku', 
            { ...filters, kategori: kategori === filters.kategori ? '' : kategori },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AuthenticatedLayout header="Katalog Buku">
            <div className="space-y-6">
                {/* Search Section */}
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-100">
                    <input
                        type="text"
                        placeholder="🔍 Cari judul, penulis, atau sinopsis..."
                        defaultValue={filters?.search || ''}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B3A60]"
                        onChange={(e) => {
                            router.get('/daftar-buku', 
                                { ...filters, search: e.target.value },
                                { preserveState: true, replace: true }
                            );
                        }}
                    />
                </div>

                {/* Filter Categories */}
                <div className="flex gap-2 flex-wrap">
                    {categories.map((kategori) => (
                        <button
                            key={kategori}
                            onClick={() => handleFilterKategori(kategori)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors capitalize ${
                                filters?.kategori === kategori
                                    ? 'bg-[#0B3A60] text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {kategori === 'fiksi' ? '📖 Fiksi' : '📚 Non-Fiksi'}
                        </button>
                    ))}
                </div>

                {selectionError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                        <span>⚠️</span> {selectionError}
                    </div>
                )}

                {/* Book Grid */}
                {bukus.data && bukus.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {bukus.data.map((buku) => (
                            <div key={buku.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-slate-200 flex flex-col">
                                
                                {/* AREA KLIK UNTUK MEMBUKA POP-UP DETAIL */}
                                <div className="cursor-pointer group flex-1" onClick={() => setDetailBuku(buku)}>
                                    {/* Book Cover */}
                                    {buku.cover ? (
                                        <div className="overflow-hidden h-48">
                                            <img src={buku.cover} alt={buku.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:from-blue-200 transition-colors duration-500">
                                            <div className="text-6xl group-hover:scale-110 transition-transform duration-500">📖</div>
                                        </div>
                                    )}

                                    {/* Book Info */}
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">{buku.judul}</h3>
                                            <p className="text-xs text-slate-500 mt-1">{buku.penulis}</p>
                                        </div>
                                        <p className="text-xs text-slate-600 line-clamp-3">{buku.sinopsis}</p>
                                        <div className="flex gap-2 text-xs">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded capitalize font-semibold">{buku.kategori}</span>
                                            <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded font-semibold">{buku.tahun_terbit}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* AREA TOMBOL BAWAH (Diluar area klik pop-up) */}
                                <div className="p-4 pt-0 mt-auto">
                                    {/* Stock Status */}
                                    <div className="pt-2 pb-3 border-t border-slate-100">
                                        <p className={`text-xs font-bold ${buku.stok > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                            {buku.stok > 0 ? `✅ ${buku.stok} tersedia` : '❌ Habis'}
                                        </p>
                                    </div>

                                    {/* Selection Button */}
                                    {borrowedBookIds.includes(buku.id) ? (
                                        <button
                                            disabled
                                            className="w-full py-2.5 rounded-lg font-bold text-sm bg-amber-100 text-amber-800 border border-amber-200 cursor-not-allowed"
                                        >
                                            ⏳ Sedang Dipinjam/Diajukan
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleToggleSelect(buku)}
                                            disabled={buku.stok <= 0 || processing}
                                            className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
                                                buku.stok <= 0
                                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                    : selectedBukus.some(b => b.id === buku.id)
                                                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-md transform scale-[1.02]'
                                                    : 'bg-[#0B3A60] text-white hover:bg-blue-700'
                                            }`}
                                        >
                                            {buku.stok <= 0
                                                ? 'Tidak Tersedia'
                                                : selectedBukus.some(b => b.id === buku.id)
                                                ? '✓ Terpilih'
                                                : '📕 Pilih Buku'
                                            }
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-slate-400">
                        <p className="text-lg">📭 Buku tidak ditemukan</p>
                    </div>
                )}

                {/* Pagination */}
                {bukus.links && bukus.links.length > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-8">
                        {bukus.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                    link.active
                                        ? 'bg-[#0B3A60] text-white'
                                        : !link.url
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Banner (Keranjang) */}
            {selectedBukus.length > 0 && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-[#0B3A60] text-white shadow-2xl rounded-2xl px-6 py-4 flex items-center justify-between gap-6 max-w-xl w-[90%] border border-blue-900/20">
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold">📚 {selectedBukus.length} Buku Terpilih</p>
                        <p className="text-xs text-blue-200 mt-0.5 truncate">
                            {selectedBukus.map(b => b.judul).join(', ')}
                        </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <button type="button" onClick={() => setSelectedBukus([])} className="text-xs font-bold text-blue-200 hover:text-white transition">Batal</button>
                        <button type="button" onClick={handleCheckout} className="bg-white text-[#0B3A60] hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md px-4 py-2 transition">Pinjam</button>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Peminjaman */}
            {showModal && selectedBukus.length > 0 && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-[#0B3A60] text-white p-6">
                            <h2 className="text-xl font-bold">Pinjam Buku</h2>
                            <p className="text-blue-100 text-sm mt-1">{selectedBukus.length} Buku Terpilih</p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {errors.buku_ids && (
                                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-bold animate-in fade-in duration-200">
                                    ⚠️ {errors.buku_ids}
                                </div>
                            )}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                                <p className="text-sm font-semibold text-slate-700 mb-2">📋 Daftar Buku yang Dipinjam</p>
                                <ul className="space-y-2 text-sm text-slate-800">
                                    {selectedBukus.map((buku, idx) => (
                                        <li key={buku.id} className="flex justify-between items-start border-b border-blue-100 pb-2 last:border-0 last:pb-0">
                                            <div>
                                                <p className="font-semibold text-slate-800">{idx + 1}. {buku.judul}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{buku.penulis}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 pt-2 border-t border-blue-200 space-y-1.5 text-xs text-slate-600">
                                    <p className="text-blue-600 font-semibold">✅ Permintaan akan dikirim ke Admin untuk persetujuan</p>
                                    <p>⏰ Deadline 7 hari akan diatur setelah admin menyetujui</p>
                                    <p>💰 Denda Rp 5.000/hari jika terlambat mengembalikan per buku</p>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => { setShowModal(false); clearErrors(); }} className="flex-1 px-4 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors">Batal</button>
                                <button type="submit" disabled={processing} className="flex-1 px-4 py-2.5 bg-[#0B3A60] text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                                    {processing ? '⏳ Mengirim...' : '📤 Kirim Permintaan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

           {/* --- MODAL BARU: DETAIL BUKU (POP-UP SAAT CARD DIKLIK) --- */}
            {detailBuku && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
                    
                    {/* Backdrop Layer */}
                    <div 
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setDetailBuku(null)} 
                    ></div>

                    {/* Modal Container */}
                    <div 
                        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row relative z-10 animate-in zoom-in-95 duration-300 ring-1 ring-slate-900/5" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Tombol Silang (Close) dengan efek Glassmorphism */}
                        <button
                            onClick={() => setDetailBuku(null)}
                            className="absolute top-4 right-4 z-20 bg-slate-100/70 hover:bg-red-100 text-slate-500 hover:text-red-600 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Bagian Kiri: Cover Buku (Gaya Buku Fisik) */}
                        <div className="md:w-5/12 bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center relative shrink-0 rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none border-b md:border-b-0 md:border-r border-slate-200">
                            <div className="w-full max-w-[200px] md:max-w-xs relative aspect-[2/3] rounded-r-2xl rounded-l-sm shadow-2xl group transition-transform duration-300 hover:-translate-y-2">
                                {/* Efek lipatan/binding buku sebelah kiri */}
                                <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/20 to-transparent z-10 rounded-l-sm"></div>
                                
                                {detailBuku.cover ? (
                                    <img src={detailBuku.cover} alt={detailBuku.judul} className="w-full h-full object-cover rounded-r-2xl rounded-l-sm" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#0B3A60]/20 to-[#0B3A60]/5 flex items-center justify-center rounded-r-2xl rounded-l-sm">
                                        <div className="text-6xl text-slate-300 group-hover:scale-110 transition-transform duration-500">📖</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bagian Kanan: Info Lengkap */}
                        <div className="md:w-7/12 p-6 md:p-10 flex flex-col h-full max-h-[90vh] bg-white rounded-b-[2rem] md:rounded-r-[2rem] md:rounded-bl-none overflow-hidden">
                            
                            {/* Scrollable Content */}
                            <div className="overflow-y-auto pr-2 pb-4 flex-1 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
                                
                                {/* Header: Kategori, Judul & Penulis */}
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-[10px] font-bold uppercase tracking-widest">{detailBuku.kategori}</span>
                                        <span className="px-3 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-md text-[10px] font-bold uppercase tracking-widest">{detailBuku.tahun_terbit}</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-2 tracking-tight">{detailBuku.judul}</h2>
                                    <p className="text-base text-slate-500 font-medium">Karya <span className="text-[#0B3A60] font-bold">{detailBuku.penulis}</span></p>
                                </div>

                                {/* Grid Informasi Tambahan */}
                                <div className="grid grid-cols-2 gap-4 py-5 border-y border-slate-100">
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Penerbit</p>
                                        <p className="text-sm font-semibold text-slate-800">{detailBuku.penerbit || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Ketersediaan</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full animate-pulse ${detailBuku.stok > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            <p className={`text-sm font-bold ${detailBuku.stok > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                {detailBuku.stok > 0 ? `${detailBuku.stok} Tersedia` : 'Sedang Habis'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sinopsis */}
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                                        Sinopsis
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed text-justify">{detailBuku.sinopsis}</p>
                                </div>
                            </div>

                            {/* Tombol Aksi (Sticky di bawah) */}
                            <div className="pt-6 mt-auto border-t border-slate-100 bg-white">
                                {borrowedBookIds.includes(detailBuku.id) ? (
                                    <button
                                        disabled
                                        className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-amber-100 text-amber-800 border border-amber-200 cursor-not-allowed"
                                    >
                                        ⏳ Sedang Dipinjam/Diajukan
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            handleToggleSelect(detailBuku);
                                            setDetailBuku(null); // Menutup otomatis
                                        }}
                                        disabled={detailBuku.stok <= 0 || processing}
                                        className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                                            detailBuku.stok <= 0
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                : selectedBukus.some(b => b.id === detailBuku.id)
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100 ring-1 ring-red-200'
                                                : 'bg-[#0B3A60] text-white hover:bg-[#082a45] shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                        }`}
                                    >
                                        {detailBuku.stok <= 0 ? (
                                            <><span>🚫</span> Tidak Tersedia Saat Ini</>
                                        ) : selectedBukus.some(b => b.id === detailBuku.id) ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                Batal Pilih Buku Ini
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                Tambahkan ke Keranjang Pinjam
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}