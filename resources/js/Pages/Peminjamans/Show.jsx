import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, usePage, router } from '@inertiajs/react';
import { formatDate, formatDateTime } from '@/Utils/dateFormatter';

export default function Show({ peminjaman }) {
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
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'menunggu_persetujuan':
                return '⏳ Menunggu Persetujuan Admin';
            case 'menunggu_pengambilan':
                return '📦 Siap Diambil';
            case 'dipinjam':
                return '📖 Sedang Dipinjam';
            case 'dikembalikan':
                return '✅ Sudah Dikembalikan';
            case 'terlambat':
                return '⏰ Terlambat';
            case 'ditolak':
                return '❌ Ditolak';
            default:
                return status;
        }
    };

    const daysLeft = peminjaman.batas_tgl_peminjaman ? 
        Math.ceil(
            (new Date(peminjaman.batas_tgl_peminjaman) - new Date()) / (1000 * 60 * 60 * 24)
        ) : 
        null;

    const allDendas = peminjaman.detail_peminjaman?.reduce((acc, detail) => {
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

    return (
        <AuthenticatedLayout header="Detail Peminjaman">
            <div className="max-w-5xl mx-auto px-4 py-8">

            <div className="space-y-6">
                {/* Info Cards - User & Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Info */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-lg font-bold text-slate-800 mb-6">👤 Informasi Member</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-slate-600 text-sm font-semibold uppercase">Nama</p>
                                <p className="font-bold text-slate-800">{peminjaman.user?.name}</p>
                            </div>
                            <div>
                                <p className="text-slate-600 text-sm font-semibold uppercase">Email</p>
                                <p className="font-mono text-slate-800">{peminjaman.user?.email}</p>
                            </div>
                            <div>
                                <p className="text-slate-600 text-sm font-semibold uppercase">No. Telp</p>
                                <p className="font-semibold text-slate-800">{peminjaman.user?.no_telp || '-'}</p>
                            </div>
                            <div>
                                <p className="text-slate-600 text-sm font-semibold uppercase">No. Identitas</p>
                                <p className="font-semibold text-slate-800">{peminjaman.user?.no_identitas || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Status Peminjaman */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-lg font-bold text-slate-800 mb-6">📋 Status Peminjaman</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-slate-600 text-sm font-semibold uppercase">Status</p>
                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(peminjaman.status_peminjaman)}`}>{ getStatusLabel(peminjaman.status_peminjaman) }</span>
                            </div>
                            {peminjaman.status_peminjaman === 'ditolak' && peminjaman.catatan_penolakan && (
                                <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded mt-2">
                                    <p className="text-xs text-rose-800 font-bold uppercase tracking-wider">Catatan Penolakan</p>
                                    <p className="font-bold text-slate-800 text-sm">{peminjaman.catatan_penolakan}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-slate-600 text-sm font-semibold uppercase">Tgl Pinjam</p>
                                <p className="font-semibold text-slate-800">{formatDate(peminjaman.tgl_peminjaman)}</p>
                            </div>
                            <div>
                                <p className="text-slate-600 text-sm font-semibold uppercase">Batas Kembali</p>
                                <p className="font-semibold text-slate-800">{peminjaman.batas_tgl_peminjaman ? formatDate(peminjaman.batas_tgl_peminjaman) : '⏳ Menunggu Persetujuan'}</p>
                            </div>
                            {peminjaman.batas_tgl_peminjaman && (
                                <div>
                                    <p className="text-slate-600 text-sm font-semibold uppercase">Sisa Waktu</p>
                                <p className={`font-bold text-lg ${daysLeft < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {daysLeft < 0 ? `⏰ ${Math.abs(daysLeft)} hari terlambat` : `✅ ${daysLeft} hari lagi`}
                                </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Struk */}
            {peminjaman.struk && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">📄 Bukti Peminjaman (Struk)</h2>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                        <p className="text-slate-600 text-sm font-semibold uppercase">Nomor Struk</p>
                        <p className="font-mono text-xl font-bold text-slate-800 mb-4">{peminjaman.struk.no_struk}</p>
                        <p className="text-slate-600 text-sm font-semibold uppercase">Dibuat pada</p>
                        <p className="font-semibold text-slate-800 mb-4">{formatDateTime(peminjaman.struk.jam_dibuat)}</p>
                        <div className="flex gap-3 flex-wrap">
                            <a 
                                href={`/struks/${peminjaman.struk.id}/download`}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
                            >
                                📥 Download PDF
                            </a>
                            <a 
                                href={`/struks/${peminjaman.struk.id}/preview`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2.5 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition inline-block"
                            >
                                👁️ Lihat Preview
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Books Borrowed */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-lg font-bold text-slate-800 mb-6">📚 Buku yang Dipinjam</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-100 border-b-2 border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left font-bold text-slate-800">No</th>
                                <th className="px-4 py-3 text-left font-bold text-slate-800">Judul</th>
                                <th className="px-4 py-3 text-left font-bold text-slate-800">Penulis</th>
                                <th className="px-4 py-3 text-left font-bold text-slate-800">Penerbit</th>
                                <th className="px-4 py-3 text-left font-bold text-slate-800">Status</th>
                                <th className="px-4 py-3 text-left font-bold text-slate-800">Catatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {peminjaman.detail_peminjaman?.map((detail, idx) => (
                                <tr key={detail.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                                    <td className="px-4 py-3 text-slate-700">{idx + 1}</td>
                                    <td className="px-4 py-3 font-semibold text-slate-800">{detail.buku?.judul}</td>
                                    <td className="px-4 py-3 text-slate-700">{detail.buku?.penulis}</td>
                                    <td className="px-4 py-3 text-slate-700">{detail.buku?.penerbit}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                                            detail.status_buku === 'dikembalikan' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {detail.status_buku === 'dikembalikan' ? '✅ Dikembalikan' : '📖 Dipinjam'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-700">{detail.catatan_kondisi || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Denda */}
            {allDendas.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">💰 Laporan Denda</h2>
                    <div className="space-y-4">
                        {allDendas.map((denda) => (
                            <div key={denda.id} className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                                <div className="mb-4 pb-2 border-b border-red-200/50">
                                    <p className="text-xs text-red-800 font-bold uppercase tracking-wider">Buku</p>
                                    <p className="font-bold text-slate-800 text-sm">{denda.buku?.judul}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-slate-600 text-sm font-semibold uppercase">Hari Terlambat</p>
                                        <p className="font-bold text-2xl text-slate-800">⏰ {denda.jumlah_hari_terlambat}</p>
                                        <p className="text-xs text-slate-600 mt-1">hari</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-600 text-sm font-semibold uppercase">Jumlah Denda</p>
                                        <p className="font-bold text-2xl text-red-600">Rp {parseFloat(denda.jumlah_denda).toLocaleString('id-ID')}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-600 text-sm font-semibold uppercase">Status Bayar</p>
                                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                                            denda.status_pembayaran === 'lunas' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {denda.status_pembayaran === 'lunas' ? '✅ Lunas' : '❌ Belum Bayar'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            </div>
        </AuthenticatedLayout>
    );
}
