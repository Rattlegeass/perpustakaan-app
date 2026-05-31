import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ members, filters }) {
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleDelete = (id) => {
        if (deleteConfirm === id) {
            router.delete(`/members/${id}`, {
                onSuccess: () => setDeleteConfirm(null),
            });
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Member Perpustakaan">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0B3A60]">Daftar Anggota</h2>
                        <p className="text-slate-500 text-sm mt-1">Total terdaftar: {members.total} member aktif</p>
                    </div>
                    <a
                        href="/members/create"
                        className="px-6 py-2.5 bg-[#0B3A60] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
                    >
                        <span>➕</span> Tambah Member Baru
                    </a>
                </div>

                {/* Search Bar */}
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-4 border border-blue-100">
                    <input
                        type="text"
                        placeholder="🔍 Cari member berdasarkan nama, email, nomor identitas, atau telepon..."
                        defaultValue={filters?.search || ''}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B3A60]"
                        onChange={(e) => {
                            router.get(
                                '/members',
                                { search: e.target.value },
                                { preserveState: true, replace: true }
                            );
                        }}
                    />
                </div>

                {/* Table Grid */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="bg-[#0B3A60] text-white">
                                <th className="px-6 py-4 text-left text-sm font-semibold w-16">No</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold w-20">Avatar</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Nama / Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Identitas & Kontak</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold">Aktivitas Pinjam</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold w-64">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.data?.map((member, index) => (
                                <tr key={member.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                                        {members.from + index}
                                    </td>
                                    <td className="px-6 py-4">
                                        {member.foto ? (
                                            <img
                                                src={member.foto}
                                                alt={member.name}
                                                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm select-none">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800 text-sm leading-snug">{member.name}</div>
                                        <div className="text-xs text-slate-400 font-mono mt-0.5">{member.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        <div className="font-medium text-xs"><span className="text-slate-400 font-normal">KTP/ID:</span> {member.no_identitas || '-'}</div>
                                        <div className="text-xs mt-1 text-slate-500"><span className="text-slate-400 font-normal">Telp:</span> {member.no_telp || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                            📖 {member.peminjamans_count || 0}x Pinjam
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2 flex-wrap">
                                            <a
                                                href={`/members/${member.id}`}
                                                className="px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1 shadow-sm"
                                            >
                                                👁️ Lihat
                                            </a>
                                            <a
                                                href={`/members/${member.id}/edit`}
                                                className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 shadow-sm"
                                            >
                                                ✏️ Edit
                                            </a>
                                            
                                            <div className="inline-flex items-center gap-1">
                                                {deleteConfirm === member.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleDelete(member.id)}
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
                                                        onClick={() => setDeleteConfirm(member.id)}
                                                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1 shadow-sm"
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

                {members.data?.length === 0 && (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <p className="text-slate-400 text-lg">📭 Tidak ada data member ditemukan</p>
                        <p className="text-slate-500 text-sm mt-1">Coba ketik kata kunci pencarian lainnya.</p>
                    </div>
                )}

                {/* Pagination */}
                {members.links && members.links.length > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-6">
                        {members.links.map((link, index) => (
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
