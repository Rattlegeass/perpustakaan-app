import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { formatDate } from '@/Utils/dateFormatter';

export default function IndexMember({ peminjamans, filters }) {
    const [cancelConfirm, setCancelConfirm] = useState(null);
    const { delete: destroy, processing } = useForm();

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
            </div>
        </AuthenticatedLayout>
    );
}
