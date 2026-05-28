import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function IndexMember({ bukus, filters, categories }) {
    const [selectedBukus, setSelectedBukus] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        buku_ids: [],
    });

    const handleToggleSelect = (buku) => {
        if (selectedBukus.some((b) => b.id === buku.id)) {
            setSelectedBukus(selectedBukus.filter((b) => b.id !== buku.id));
        } else {
            setSelectedBukus([...selectedBukus, buku]);
        }
    };

    const handleCheckout = () => {
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

                {/* Book Grid */}
                {bukus.data && bukus.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {bukus.data.map((buku) => (
                            <div key={buku.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-slate-200">
                                {/* Book Cover Placeholder */}
                                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                                    <div className="text-6xl">📖</div>
                                </div>

                                {/* Book Info */}
                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-800 line-clamp-2">{buku.judul}</h3>
                                        <p className="text-xs text-slate-500 mt-1">{buku.penulis}</p>
                                    </div>

                                    {/* Sinopsis */}
                                    <p className="text-xs text-slate-600 line-clamp-3">{buku.sinopsis}</p>

                                    {/* Meta Info */}
                                    <div className="flex gap-2 text-xs">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded capitalize font-semibold">{buku.kategori}</span>
                                        <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded font-semibold">{buku.tahun_terbit}</span>
                                    </div>

                                    {/* Stock Status */}
                                    <div className="pt-2 border-t border-slate-200">
                                        <p className={`text-xs font-bold ${
                                            buku.stok > 0 ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                            {buku.stok > 0 ? `✅ ${buku.stok} tersedia` : '❌ Habis'}
                                        </p>
                                    </div>

                                    {/* Selection Button */}
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

            {/* Floating Banner */}
            {selectedBukus.length > 0 && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-[#0B3A60] text-white shadow-2xl rounded-2xl px-6 py-4 flex items-center justify-between gap-6 max-w-xl w-[90%] border border-blue-900/20">
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold">📚 {selectedBukus.length} Buku Terpilih</p>
                        <p className="text-xs text-blue-200 mt-0.5 truncate">
                            {selectedBukus.map(b => b.judul).join(', ')}
                        </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={() => setSelectedBukus([])}
                            className="text-xs font-bold text-blue-200 hover:text-white transition"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleCheckout}
                            className="bg-white text-[#0B3A60] hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md px-4 py-2 transition"
                        >
                            Pinjam
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Peminjaman */}
            {showModal && selectedBukus.length > 0 && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        {/* Header */}
                        <div className="bg-[#0B3A60] text-white p-6">
                            <h2 className="text-xl font-bold">Pinjam Buku</h2>
                            <p className="text-blue-100 text-sm mt-1">{selectedBukus.length} Buku Terpilih</p>
                        </div>

                        {/* Content */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2.5 bg-[#0B3A60] text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {processing ? '⏳ Mengirim...' : '📤 Kirim Permintaan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
