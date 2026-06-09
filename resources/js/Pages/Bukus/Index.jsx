import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ bukus, filters, user }) {
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleDelete = (id) => {
        if (deleteConfirm === id) {
            router.delete(`/bukus/${id}`, {
                onSuccess: () => setDeleteConfirm(null),
            });
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Buku">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0B3A60]">Daftar Buku</h2>
                        <p className="text-slate-500 text-sm mt-1">Total: {bukus.total} buku</p>
                    </div>
                    {user.role === 'admin' && (
                        <a
                            href="/bukus/create"
                            className="px-6 py-2.5 bg-[#0B3A60] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                        >
                            + Tambah Buku
                        </a>
                    )}
                </div>

                {/* Search Section */}
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-4 border border-blue-100">
                    <input
                        type="text"
                        placeholder="🔍 Cari berdasarkan judul atau penulis..."
                        defaultValue={filters?.search || ''}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B3A60]"
                        onChange={(e) => {
                            router.get(
                                '/bukus',
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
                                <th className="px-6 py-4 text-left text-sm font-semibold">Judul</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Penulis</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Penerbit</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold">Tahun</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold">Stok</th>
                                <th className="px-9 py-4 text-left text-sm font-semibold">Kategori</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bukus.data?.map((buku, index) => (
                                <tr key={buku.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-700">{bukus.from + index}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-800">{buku.judul}</div>
                                        {buku.sinopsis && (
                                            <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                                                {buku.sinopsis}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{buku.penulis}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{buku.penerbit}</td>
                                    <td className="px-6 py-4 text-center text-sm text-slate-700">{buku.tahun_terbit}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${buku.stok > 5 ? 'bg-green-100 text-green-800' :
                                            buku.stok > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {buku.stok} stok
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                                            {buku.kategori}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <a
                                                href={`/bukus/${buku.id}`}
                                                className="px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                👁️ Lihat
                                            </a>
                                            <a
                                                href={`/bukus/${buku.id}/edit`}
                                                className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600 transition-colors"
                                            >
                                                ✏️ Edit
                                            </a>
                                            {user.role === 'admin' && (
                                                <>
                                                    <button
                                                        onClick={() => setDeleteConfirm(deleteConfirm === buku.id ? null : buku.id)}
                                                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
                                                    >
                                                        {deleteConfirm === buku.id ? '❌ Yakin?' : '🗑️ Hapus'}
                                                    </button>
                                                    {deleteConfirm === buku.id && (
                                                        <button
                                                            onClick={() => handleDelete(buku.id)}
                                                            className="px-2 py-1.5 bg-red-700 text-white text-xs font-bold rounded-lg"
                                                        >
                                                            Ya
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {bukus.data?.length === 0 && (
                    <div className="text-center py-16 text-slate-400">
                        <p className="text-lg">📭 Tidak ada data buku</p>
                    </div>
                )}

                {/* Pagination */}
                {bukus.links && bukus.links.length > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-6">
                        {bukus.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${link.active
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
