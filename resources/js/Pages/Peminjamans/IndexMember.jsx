import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { formatDate } from '@/Utils/dateFormatter';

export default function IndexMember({ peminjamans, filters, allBukus = [], borrowedBookIds = [] }) {
    const [cancelConfirm, setCancelConfirm] = useState(null);
    const { delete: destroy, processing } = useForm();

    // States for Editing
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPeminjaman, setEditingPeminjaman] = useState(null);
    const [editBukuIds, setEditBukuIds] = useState([]);
    const [editSearch, setEditSearch] = useState('');
    const [editErrors, setEditErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getStatusColor = (status) => {
        switch(status) {
            case 'menunggu_persetujuan':
                return 'bg-yellow-100 text-yellow-800';
            case 'menunggu_pengambilan':
                return 'bg-orange-100 text-orange-800';
            case 'dipinjam':
                return 'bg-blue-100 text-blue-800';
            case 'dikembalikan':
                return 'bg-green-100 text-green-800';
            case 'terlambat':
                return 'bg-red-100 text-red-800';
            case 'ditolak':
                return 'bg-rose-100 text-rose-800';
            default:
                return 'bg-slate-100 text-slate-800';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'menunggu_persetujuan':
                return '⏳';
            case 'menunggu_pengambilan':
                return '📦';
            case 'dipinjam':
                return '📖';
            case 'dikembalikan':
                return '✅';
            case 'terlambat':
                return '⏰';
            case 'ditolak':
                return '❌';
            default:
                return '❓';
        }
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'menunggu_persetujuan':
                return 'Menunggu Persetujuan';
            case 'menunggu_pengambilan':
                return 'Siap Diambil';
            case 'dipinjam':
                return 'Sedang Dipinjam';
            case 'dikembalikan':
                return 'Sudah Dikembalikan';
            case 'terlambat':
                return 'Terlambat';
            case 'ditolak':
                return 'Ditolak';
            default:
                return status;
        }
    };

    const handleCancel = (id) => {
        if (cancelConfirm === id) {
            destroy(`/peminjamans-batal/${id}`, {
                onSuccess: () => setCancelConfirm(null),
            });
        }
    };

    const getBukuDetail = (id) => {
        const foundInAll = allBukus.find(b => b.id === id);
        if (foundInAll) return foundInAll;
        
        const foundInCurrent = editingPeminjaman?.detail_peminjaman?.find(d => d.buku_id === id)?.buku;
        return foundInCurrent;
    };

    const handleUpdatePeminjaman = (e) => {
        e.preventDefault();
        if (editBukuIds.length === 0) {
            setEditErrors({ buku_ids: 'Harap pilih minimal 1 buku.' });
            return;
        }
        if (editBukuIds.length > 5) {
            setEditErrors({ buku_ids: 'Maksimal 5 buku dalam sekali peminjaman.' });
            return;
        }
        setIsSubmitting(true);
        setEditErrors({});
        router.patch(`/peminjamans-ubah/${editingPeminjaman.id}`, {
            buku_ids: editBukuIds,
        }, {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingPeminjaman(null);
                setEditBukuIds([]);
                setIsSubmitting(false);
            },
            onError: (errors) => {
                setEditErrors(errors);
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    return (
        <AuthenticatedLayout header="Peminjaman Saya">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0B3A60]">Riwayat Peminjaman</h2>
                        <p className="text-slate-500 text-sm mt-1">Total: {peminjamans.total} peminjaman</p>
                    </div>
                    <a
                        href="/daftar-buku"
                        className="px-6 py-2.5 bg-[#0B3A60] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                        + Pinjam Buku
                    </a>
                </div>

                {/* Search */}
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-4 border border-blue-100">
                    <input
                        type="text"
                        placeholder="🔍 Cari berdasarkan tanggal atau nama buku..."
                        defaultValue={filters?.search || ''}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B3A60]"
                        onChange={(e) => {
                            router.get(
                                '/peminjamans-saya',
                                { search: e.target.value },
                                { preserveState: true, replace: true }
                            );
                        }}
                    />
                </div>

                {/* Peminjaman List */}
                {peminjamans.data && peminjamans.data.length > 0 ? (
                    <div className="space-y-4">
                        {peminjamans.data.map((pinjam) => (
                            <div key={pinjam.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-6 space-y-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Daftar Buku</p>
                                            <ul className="space-y-2">
                                                {pinjam.detail_peminjaman?.map((detail) => (
                                                    <li key={detail.id} className="text-sm text-slate-800 flex flex-col">
                                                        <span className="font-bold">{detail.buku?.judul}</span>
                                                        <span className="text-xs text-slate-500">Penulis: {detail.buku?.penulis} • Status: {detail.status_buku === 'dikembalikan' ? '✅ Dikembalikan' : '📖 Dipinjam'}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold shrink-0 ${getStatusColor(pinjam.status_peminjaman)}`}>
                                            <span>{getStatusIcon(pinjam.status_peminjaman)}</span>
                                            {getStatusLabel(pinjam.status_peminjaman)}
                                        </span>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-y border-slate-200">
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Tgl Pinjam</p>
                                            <p className="text-sm font-bold text-slate-800 mt-1">{formatDate(pinjam.tgl_peminjaman)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Batas Kembali</p>
                                            <p className="text-sm font-bold text-slate-800 mt-1">{pinjam.batas_tgl_peminjaman ? formatDate(pinjam.batas_tgl_peminjaman) : '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Jumlah Item</p>
                                            <p className="text-sm font-bold text-slate-800 mt-1">{pinjam.detail_peminjaman?.length || 0} Buku</p>
                                        </div>
                                    </div>

                                    {/* Catatan Penolakan Info */}
                                    {pinjam.status_peminjaman === 'ditolak' && pinjam.catatan_penolakan && (
                                         <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 space-y-1">
                                             <p className="text-sm font-bold text-rose-800">❌ Catatan Penolakan:</p>
                                             <p className="text-xs text-rose-700 font-semibold">{pinjam.catatan_penolakan}</p>
                                         </div>
                                     )}

                                    {/* Denda Info */}
                                    {(() => {
                                        const cardDendas = pinjam.detail_peminjaman?.reduce((acc, detail) => {
                                            if (detail.dendas && detail.dendas.length > 0) {
                                                detail.dendas.forEach(denda => {
                                                    acc.push({
                                                        ...denda,
                                                        buku: detail.buku
                                                    });
                                                });
                                            }
                                            return acc;
                                        }, []) || [];

                                        if (cardDendas.length === 0) return null;

                                        return (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                                                <p className="text-sm font-bold text-red-800">⚠️ Rincian Denda:</p>
                                                {cardDendas.map((denda) => (
                                                    <div key={denda.id} className="text-xs text-red-700 border-b border-red-100 last:border-0 pb-1.5 last:pb-0">
                                                        <p className="font-semibold text-slate-800">{denda.buku?.judul}</p>
                                                        <p className="mt-0.5">
                                                            Rp {new Intl.NumberFormat('id-ID').format(parseFloat(denda.jumlah_denda))} ({denda.jumlah_hari_terlambat} hari terlambat) - 
                                                            <span className={`ml-1 font-bold ${denda.status_pembayaran === 'belum_bayar' ? 'text-red-900' : 'text-green-600'}`}>
                                                                {denda.status_pembayaran === 'belum_bayar' ? '⏳ Belum Dibayar' : '✅ Lunas'}
                                                            </span>
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-2">
                                        {pinjam.struk && (
                                            <a
                                                href={route('struks.member.download', pinjam.struk.id)}
                                                className="px-4 py-2.5 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                📄 Download Struk
                                            </a>
                                        )}
                                        {pinjam.status_peminjaman === 'menunggu_persetujuan' && (
                                            <button
                                                onClick={() => {
                                                    setEditingPeminjaman(pinjam);
                                                    setEditBukuIds(pinjam.detail_peminjaman?.map(d => d.buku_id) || []);
                                                    setEditErrors({});
                                                    setEditSearch('');
                                                    setShowEditModal(true);
                                                }}
                                                disabled={processing || isSubmitting}
                                                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                📝 Edit Peminjaman
                                            </button>
                                        )}
                                        {(pinjam.status_peminjaman === 'menunggu_persetujuan' || pinjam.status_peminjaman === 'menunggu_pengambilan') && (
                                            <>
                                                <button
                                                    onClick={() => setCancelConfirm(cancelConfirm === pinjam.id ? null : pinjam.id)}
                                                    disabled={processing}
                                                    className="px-4 py-2.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                                >
                                                    {cancelConfirm === pinjam.id ? '❌ Yakin Batalkan?' : '🗑️ Batalkan'}
                                                </button>
                                                {cancelConfirm === pinjam.id && (
                                                    <button
                                                        onClick={() => handleCancel(pinjam.id)}
                                                        disabled={processing}
                                                        className="px-4 py-2.5 bg-red-700 text-white text-sm font-bold rounded-lg disabled:opacity-50"
                                                    >
                                                        Ya, Batalkan
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-slate-400">
                        <p className="text-lg mb-2">📭 Belum ada peminjaman</p>
                        <p className="text-sm">Mulai dengan <a href="/daftar-buku" className="text-[#0B3A60] font-bold hover:underline">meminjam buku</a></p>
                    </div>
                )}

                {/* Pagination */}
                {peminjamans.links && peminjamans.links.length > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-8">
                        {peminjamans.links.map((link, index) => (
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
            {/* Modal Edit Peminjaman */}
            {showEditModal && editingPeminjaman && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="bg-[#0B3A60] text-white p-6">
                            <h2 className="text-xl font-bold">📝 Edit Permintaan Peminjaman</h2>
                            <p className="text-blue-100 text-xs mt-1">Status: Menunggu Persetujuan Admin</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleUpdatePeminjaman} className="flex flex-col flex-1 overflow-hidden">
                            {/* Scrollable Content */}
                            <div className="p-6 space-y-6 overflow-y-auto flex-1">
                                {/* Error message */}
                                {editErrors.buku_ids && (
                                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm font-semibold">
                                        ⚠️ {editErrors.buku_ids}
                                    </div>
                                )}

                                {/* Selected Books */}
                                <div className="space-y-3">
                                    <p className="text-sm font-bold text-slate-700">📋 Buku Yang Dipilih ({editBukuIds.length})</p>
                                    {editBukuIds.length > 0 ? (
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                            {editBukuIds.map((bukuId, index) => {
                                                const b = getBukuDetail(bukuId);
                                                return (
                                                    <div key={bukuId} className="flex justify-between items-center p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                                                        <div className="min-w-0 flex-1 pr-3">
                                                            <p className="text-sm font-bold text-slate-800 truncate">{index + 1}. {b?.judul || 'Buku Tidak Ditemukan'}</p>
                                                            <p className="text-xs text-slate-500 truncate">{b?.penulis || '-'}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditBukuIds(editBukuIds.filter(id => id !== bukuId));
                                                                setEditErrors({});
                                                            }}
                                                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                            title="Hapus buku"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                                            <p className="text-sm">Belum ada buku terpilih. Silakan tambah buku di bawah.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Add Books Section */}
                                <div className="space-y-3 pt-2 border-t border-slate-100">
                                    <p className="text-sm font-bold text-slate-700">🔍 Tambah Buku Baru</p>
                                    <input
                                        type="text"
                                        value={editSearch}
                                        onChange={(e) => setEditSearch(e.target.value)}
                                        placeholder="Cari berdasarkan judul atau penulis..."
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B3A60] text-sm"
                                    />
                                    
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mt-2">
                                        {(() => {
                                            const filtered = allBukus.filter(buku => {
                                                if (editBukuIds.includes(buku.id)) return false;
                                                if (borrowedBookIds.includes(buku.id)) return false; // Exclude actively borrowed books
                                                if (!editSearch) return true;
                                                const q = editSearch.toLowerCase();
                                                return buku.judul.toLowerCase().includes(q) || 
                                                       buku.penulis.toLowerCase().includes(q);
                                            });

                                            if (filtered.length === 0) {
                                                return (
                                                    <p className="text-center py-4 text-xs text-slate-400">
                                                        {editSearch ? 'Tidak ada buku yang cocok' : 'Tidak ada buku lain yang tersedia'}
                                                    </p>
                                                );
                                            }

                                            return filtered.map(buku => (
                                                <div key={buku.id} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl hover:bg-slate-100/80 transition-colors">
                                                    <div className="min-w-0 flex-1 pr-3">
                                                        <p className="text-xs font-bold text-slate-800 truncate">{buku.judul}</p>
                                                        <p className="text-[10px] text-slate-500 truncate">{buku.penulis} • Stok: {buku.stok}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        disabled={editBukuIds.length >= 5}
                                                        onClick={() => {
                                                            if (editBukuIds.length >= 5) {
                                                                setEditErrors({ buku_ids: 'Maksimal 5 buku dalam sekali peminjaman.' });
                                                                return;
                                                            }
                                                            setEditBukuIds([...editBukuIds, buku.id]);
                                                            setEditSearch('');
                                                            setEditErrors({});
                                                        }}
                                                        className="px-3 py-1.5 bg-[#0B3A60] hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-colors shrink-0 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                                                    >
                                                        + Tambah
                                                    </button>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingPeminjaman(null);
                                    }}
                                    className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-300 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || editBukuIds.length === 0}
                                    className="px-5 py-2 bg-[#0B3A60] text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? '⏳ Menyimpan...' : '💾 Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            </div>
        </AuthenticatedLayout>
    );
}
