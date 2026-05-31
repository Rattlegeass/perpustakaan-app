import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { formatDate } from '@/Utils/dateFormatter';

export default function Index({ peminjamans, filters }) {
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [rejectConfirm, setRejectConfirm] = useState(null);

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

    const handleApprove = (peminjamanId) => {
        router.patch(`/peminjamans/${peminjamanId}/approve`, {}, {
            onSuccess: () => {
                // Refresh will happen automatically
            }
        });
    };

    const handleConfirmPickup = (peminjamanId) => {
        router.patch(`/peminjamans/${peminjamanId}/confirm-pickup`, {}, {
            onSuccess: () => {
                // Refresh will happen automatically
            }
        });
    };

    const handleReject = (id) => {
        router.patch(`/peminjamans/${id}/reject`, {}, {
            onSuccess: () => setRejectConfirm(null),
        });
    };

    const handleDelete = (id) => {
        if (deleteConfirm === id) {
            router.delete(`/peminjamans/${id}`, {
                onSuccess: () => setDeleteConfirm(null),
            });
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Peminjaman">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0B3A60]">Daftar Peminjaman</h2>
                        <p className="text-slate-500 text-sm mt-1">Total: {peminjamans.total} peminjaman</p>
                    </div>
                    <a
                        href="/peminjamans/create"
                        className="px-6 py-2.5 bg-[#0B3A60] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                        + Buat Peminjaman Baru
                    </a>
                </div>

                {/* Search Section */}
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-4 border border-blue-100">
                    <input
                        type="text"
                        placeholder="🔍 Cari berdasarkan tanggal, status, atau nama user..."
                        defaultValue={filters?.search || ''}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B3A60]"
                        onChange={(e) => {
                            router.get(
                                '/peminjamans',
                                { search: e.target.value },
                                { preserveState: true, replace: true }
                            );
                        }}
                    />
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#0B3A60] text-white">
                                <th className="px-6 py-4 text-left text-sm font-semibold">No</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Tgl Pinjam</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Batas Kembali</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {peminjamans.data?.map((pinjam, index) => (
                                <tr key={pinjam.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-700">{peminjamans.from + index}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-800">{pinjam.user?.name}</div>
                                        <div className="text-xs text-slate-500">{pinjam.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        <div className="font-medium">{formatDate(pinjam.tgl_peminjaman)}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        <div className="font-medium">{pinjam.batas_tgl_peminjaman ? formatDate(pinjam.batas_tgl_peminjaman) : '-'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(pinjam.status_peminjaman)}`}>
                                            <span>{getStatusIcon(pinjam.status_peminjaman)}</span>
                                            {getStatusLabel(pinjam.status_peminjaman)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2 flex-wrap">
                                            {pinjam.status_peminjaman === 'menunggu_persetujuan' && (
                                                <button
                                                    onClick={() => handleApprove(pinjam.id)}
                                                    className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600 transition-colors"
                                                >
                                                    ✅ Setujui
                                                </button>
                                            )}
                                            {pinjam.status_peminjaman === 'menunggu_pengambilan' && (
                                                <button
                                                    onClick={() => handleConfirmPickup(pinjam.id)}
                                                    className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors"
                                                >
                                                    📖 Konfirmasi Pengambilan
                                                </button>
                                            )}
                                            <a
                                                href={`/peminjamans/${pinjam.id}`}
                                                className="px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                👁️ Lihat
                                            </a>
                                            {pinjam.status_peminjaman === 'dipinjam' && (
                                                <a
                                                    href={`/peminjamans/${pinjam.id}/edit`}
                                                    className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors"
                                                >
                                                    ↩️ Kembali
                                                </a>
                                            )}
                                            {/* Tombol Tolak (Hanya untuk pending / siap ambil) */}
                                            {(pinjam.status_peminjaman === 'menunggu_persetujuan' || pinjam.status_peminjaman === 'menunggu_pengambilan') && (
                                                <div className="inline-flex items-center gap-1">
                                                    {rejectConfirm === pinjam.id ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleReject(pinjam.id)}
                                                                className="px-2.5 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors"
                                                            >
                                                                Ya, Tolak
                                                            </button>
                                                            <button
                                                                onClick={() => setRejectConfirm(null)}
                                                                className="px-2 py-1.5 bg-slate-500 text-white text-xs font-bold rounded-lg hover:bg-slate-600 transition-colors"
                                                            >
                                                                Batal
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setRejectConfirm(pinjam.id);
                                                                setDeleteConfirm(null);
                                                            }}
                                                            className="px-3 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600 transition-colors"
                                                        >
                                                            ❌ Tolak
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {/* Tombol Hapus (Untuk semua status) */}
                                            <div className="inline-flex items-center gap-1">
                                                {deleteConfirm === pinjam.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleDelete(pinjam.id)}
                                                            className="px-2.5 py-1.5 bg-red-700 text-white text-xs font-bold rounded-lg hover:bg-red-800 transition-colors"
                                                        >
                                                            Ya, Hapus
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className="px-2 py-1.5 bg-slate-500 text-white text-xs font-bold rounded-lg hover:bg-slate-600 transition-colors"
                                                        >
                                                            Batal
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setDeleteConfirm(pinjam.id);
                                                            setRejectConfirm(null);
                                                        }}
                                                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
                                                    >
                                                        🗑️ Hapus
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {peminjamans.data?.length === 0 && (
                    <div className="text-center py-16 text-slate-400">
                        <p className="text-lg">📭 Tidak ada data peminjaman</p>
                    </div>
                )}

                {/* Pagination */}
                {peminjamans.links && peminjamans.links.length > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-6">
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
