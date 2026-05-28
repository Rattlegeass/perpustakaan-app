import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminIndex({ dendas, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        router.get(
            route('dendas.index'),
            { search: val, status },
            { preserveState: true, replace: true }
        );
    };

    const handleStatusChange = (e) => {
        const val = e.target.value;
        setStatus(val);
        router.get(
            route('dendas.index'),
            { search, status: val },
            { preserveState: true, replace: true }
        );
    };

    const handleBayarDenda = (dendaId) => {
        if (confirm('Apakah Anda yakin ingin mengonfirmasi pembayaran denda ini menjadi lunas?')) {
            router.patch(`/dendas/${dendaId}/bayar`);
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Denda">
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0B3A60]">Daftar Denda Anggota</h2>
                        <p className="text-slate-500 text-sm mt-1">Total denda tercatat: {dendas.total} denda</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-4 border border-blue-100 flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cari Member / Buku</label>
                        <input
                            type="text"
                            value={search}
                            placeholder="🔍 Ketik nama member, email, atau judul buku..."
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B3A60]"
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* Status Select */}
                    <div className="md:w-64">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Filter Status</label>
                        <select
                            value={status}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B3A60] bg-white font-semibold text-slate-700"
                            onChange={handleStatusChange}
                        >
                            <option value="all">📂 Semua Status</option>
                            <option value="belum_bayar">⏳ Belum Dibayar</option>
                            <option value="lunas">✅ Lunas</option>
                        </select>
                    </div>
                </div>

                {/* Table View */}
                {dendas.data && dendas.data.length > 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ID / Member</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Buku yang Terlambat</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Terlambat</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah Denda</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {dendas.data.map((denda) => (
                                        <tr key={denda.id} className="hover:bg-slate-50 transition-colors">
                                            {/* Member info */}
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800 text-sm">#{denda.id}</div>
                                                <div className="font-semibold text-slate-700 text-xs mt-1">{denda.detail_peminjaman?.peminjaman?.user?.name}</div>
                                                <div className="text-slate-400 font-mono text-[10px]">{denda.detail_peminjaman?.peminjaman?.user?.email}</div>
                                            </td>

                                            {/* Book info */}
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800 text-sm">{denda.detail_peminjaman?.buku?.judul || 'Buku'}</div>
                                                <div className="text-slate-500 text-xs">Penulis: {denda.detail_peminjaman?.buku?.penulis}</div>
                                            </td>

                                            {/* Late days */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                                    ⏰ {denda.jumlah_hari_terlambat} hari
                                                </span>
                                            </td>

                                            {/* Fine amount */}
                                            <td className="px-6 py-4">
                                                <div className="font-black text-slate-800 text-sm">
                                                    Rp {new Intl.NumberFormat('id-ID').format(parseFloat(denda.jumlah_denda))}
                                                </div>
                                                <div className="text-[10px] text-slate-400">Rp 5.000 / hari</div>
                                            </td>

                                            {/* Status badges */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                    denda.status_pembayaran === 'belum_bayar'
                                                        ? 'bg-red-50 text-red-700 border border-red-200'
                                                        : 'bg-green-50 text-green-700 border border-green-200'
                                                }`}>
                                                    {denda.status_pembayaran === 'belum_bayar' ? '⏳ Belum Dibayar' : '✅ Lunas'}
                                                </span>
                                            </td>

                                            {/* Action button */}
                                            <td className="px-6 py-4 text-center">
                                                {denda.status_pembayaran === 'belum_bayar' ? (
                                                    <button
                                                        onClick={() => handleBayarDenda(denda.id)}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-sm text-xs"
                                                    >
                                                        💵 Konfirmasi Lunas
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-semibold">Tindakan Selesai</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {dendas.links && dendas.links.length > 0 && (
                            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-center gap-1">
                                {dendas.links.map((link, index) => (
                                    <button
                                        key={index}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
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
                ) : (
                    <div className="text-center py-20 bg-white border border-slate-200 rounded-xl">
                        <p className="text-slate-400 text-lg mb-2">🎉 Tidak ada data denda ditemukan</p>
                        <p className="text-slate-500 text-sm">Semua member patuh waktu atau data tidak cocok dengan filter saat ini</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
