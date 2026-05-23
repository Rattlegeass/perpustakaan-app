import { Link } from '@inertiajs/react';

export default function Show({ peminjaman }) {
    const getStatusColor = (status) => {
        switch(status) {
            case 'active':
                return 'bg-blue-100 text-blue-800';
            case 'returned':
                return 'bg-green-100 text-green-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'active':
                return 'Sedang Dipinjam';
            case 'returned':
                return 'Sudah Dikembalikan';
            case 'overdue':
                return 'Terlambat';
            default:
                return status;
        }
    };

    const daysLeft = Math.ceil(
        (new Date(peminjaman.batas_tgl_peminjaman) - new Date()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Detail Peminjaman</h1>
                <Link
                    href="/peminjamans"
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Kembali
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* User Info */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-lg font-bold mb-4">Informasi User</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-gray-600 text-sm">Nama</p>
                            <p className="font-semibold">{peminjaman.user?.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Email</p>
                            <p className="font-semibold">{peminjaman.user?.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">No. Telp</p>
                            <p className="font-semibold">{peminjaman.user?.no_telp || '-'}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">No. Identitas</p>
                            <p className="font-semibold">{peminjaman.user?.no_identitas || '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Peminjaman Status */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-lg font-bold mb-4">Status Peminjaman</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-gray-600 text-sm">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(peminjaman.status_peminjaman)}`}>
                                {getStatusLabel(peminjaman.status_peminjaman)}
                            </span>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Tanggal Pinjam</p>
                            <p className="font-semibold">{peminjaman.tgl_peminjaman}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Batas Pengembalian</p>
                            <p className="font-semibold">{peminjaman.batas_tgl_peminjaman}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Sisa Waktu</p>
                            <p className={`font-semibold ${daysLeft < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {daysLeft < 0 ? `Terlambat ${Math.abs(daysLeft)} hari` : `${daysLeft} hari`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Struk */}
            {peminjaman.struk && (
                <div className="bg-white p-6 rounded shadow mb-6">
                    <h2 className="text-lg font-bold mb-4">Bukti Peminjaman</h2>
                    <div className="bg-blue-50 p-4 rounded border border-blue-200">
                        <p className="text-gray-600 text-sm">Nomor Struk</p>
                        <p className="font-mono text-lg font-bold">{peminjaman.struk.no_struk}</p>
                        <p className="text-gray-600 text-sm mt-2">Dibuat pada</p>
                        <p className="font-semibold">{new Date(peminjaman.struk.jam_dibuat).toLocaleString('id-ID')}</p>
                        <div className="mt-4 flex gap-3">
                            <a 
                                href={`/struks/${peminjaman.struk.id}/download`}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
                            >
                                📥 Download PDF
                            </a>
                            <a 
                                href={`/struks/${peminjaman.struk.id}/preview`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 inline-block"
                            >
                                👁️ Lihat Preview
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Books Borrowed */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-lg font-bold mb-4">Buku yang Dipinjam</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-200 border-b">
                            <tr>
                                <th className="border p-3 text-left">No</th>
                                <th className="border p-3 text-left">Judul</th>
                                <th className="border p-3 text-left">Penulis</th>
                                <th className="border p-3 text-left">Penerbit</th>
                                <th className="border p-3 text-left">Status Buku</th>
                                <th className="border p-3 text-left">Catatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {peminjaman.detail_peminjaman?.map((detail, idx) => (
                                <tr key={detail.id} className="hover:bg-gray-50">
                                    <td className="border p-3">{idx + 1}</td>
                                    <td className="border p-3 font-semibold">{detail.buku?.judul}</td>
                                    <td className="border p-3">{detail.buku?.penulis}</td>
                                    <td className="border p-3">{detail.buku?.penerbit}</td>
                                    <td className="border p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            detail.status_buku === 'dikembalikan' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {detail.status_buku}
                                        </span>
                                    </td>
                                    <td className="border p-3">{detail.condition_notes || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Denda */}
            {peminjaman.detail_peminjaman?.[0]?.dendas?.length > 0 && (
                <div className="bg-white p-6 rounded shadow mt-6">
                    <h2 className="text-lg font-bold mb-4">Denda</h2>
                    <div className="space-y-4">
                        {peminjaman.detail_peminjaman?.[0]?.dendas?.map((denda, idx) => (
                            <div key={denda.id} className="bg-red-50 border border-red-200 p-4 rounded">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-600 text-sm">Hari Terlambat</p>
                                        <p className="font-bold text-lg">{denda.jumlah_hari_terlambat} hari</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-600 text-sm">Total Denda</p>
                                        <p className="font-bold text-lg text-red-600">Rp {parseInt(denda.total_denda).toLocaleString('id-ID')}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Status Pembayaran</p>
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                            denda.status_pembayaran === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {denda.status_pembayaran === 'paid' ? 'Sudah Dibayar' : 'Belum Dibayar'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
