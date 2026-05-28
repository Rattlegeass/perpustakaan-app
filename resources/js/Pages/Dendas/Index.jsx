import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatDate } from '@/Utils/dateFormatter';

export default function Index({ dendas }) {
    const totalDenda = dendas.data.reduce((sum, denda) => sum + parseFloat(denda.jumlah_denda || 0), 0);
    const belumBayar = dendas.data.filter(d => d.status_pembayaran === 'belum_bayar').length;
    const sudahBayar = dendas.data.filter(d => d.status_pembayaran === 'lunas').length;

    return (
        <AuthenticatedLayout header="Daftar Denda Saya">
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Denda */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                        <p className="text-red-600 text-sm font-semibold uppercase tracking-wider mb-2">Total Denda</p>
                        <p className="text-2xl font-black text-red-800">
                            Rp {new Intl.NumberFormat('id-ID').format(totalDenda)}
                        </p>
                    </div>

                    {/* Belum Dibayar */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                        <p className="text-orange-600 text-sm font-semibold uppercase tracking-wider mb-2">Belum Dibayar</p>
                        <p className="text-2xl font-black text-orange-800">
                            {belumBayar} <span className="text-sm">denda</span>
                        </p>
                    </div>

                    {/* Sudah Dibayar */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                        <p className="text-green-600 text-sm font-semibold uppercase tracking-wider mb-2">Sudah Dibayar</p>
                        <p className="text-2xl font-black text-green-800">
                            {sudahBayar} <span className="text-sm">denda</span>
                        </p>
                    </div>
                </div>

                {/* Denda List */}
                {dendas.data && dendas.data.length > 0 ? (
                    <div className="space-y-4">
                        {dendas.data.map((denda) => (
                            <div key={denda.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-6 space-y-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800">
                                                {denda.detail_peminjaman?.buku?.judul || 'Buku'}
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-1">
                                                {denda.detail_peminjaman?.buku?.penulis}
                                            </p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${denda.status_pembayaran === 'belum_bayar'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-green-100 text-green-800'
                                            }`}>
                                            {denda.status_pembayaran === 'belum_bayar' ? '⏳ Belum Dibayar' : '✅ Lunas'}
                                        </span>
                                    </div>

                                    {/* Denda Details */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-slate-600">Jumlah Hari Terlambat:</p>
                                            <p className="text-sm font-bold text-slate-800">{denda.jumlah_hari_terlambat} hari</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-slate-600">Tarif Denda:</p>
                                            <p className="text-sm font-bold text-slate-800">Rp 5.000 / hari</p>
                                        </div>
                                        <div className="border-t border-blue-300 pt-2 mt-2 flex justify-between items-center">
                                            <p className="font-bold text-slate-800">Total Denda:</p>
                                            <p className="text-lg font-black text-blue-900">
                                                Rp {new Intl.NumberFormat('id-ID').format(parseFloat(denda.jumlah_denda))}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Peminjaman Info */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-200">
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Tgl Pinjam</p>
                                            <p className="text-sm font-bold text-slate-800 mt-1">
                                                {denda.detail_peminjaman?.peminjaman?.tgl_peminjaman ? formatDate(denda.detail_peminjaman.peminjaman.tgl_peminjaman) : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Batas Kembali</p>
                                            <p className="text-sm font-bold text-slate-800 mt-1">
                                                {denda.detail_peminjaman?.peminjaman?.batas_tgl_peminjaman ? formatDate(denda.detail_peminjaman.peminjaman.batas_tgl_peminjaman) : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Kategori</p>
                                            <p className="text-sm font-bold text-slate-800 mt-1 capitalize">{denda.detail_peminjaman?.buku?.kategori}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">ID Denda</p>
                                            <p className="text-sm font-bold text-slate-800 mt-1">#{denda.id}</p>
                                        </div>
                                    </div>

                                    {/* Info Box */}
                                    {denda.status_pembayaran === 'belum_bayar' && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <p className="text-sm text-red-700">
                                                <span className="font-bold">⚠️ Perhatian:</span> Silakan segera membayar denda untuk menghindari penalti lebih lanjut. Hubungi admin perpustakaan untuk informasi pembayaran.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-slate-400">
                        <p className="text-lg mb-2">🎉 Tidak ada denda</p>
                        <p className="text-sm">Anda sudah membayar semua denda atau belum pernah terlambat mengembalikan buku</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
