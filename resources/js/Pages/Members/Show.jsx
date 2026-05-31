import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatDate } from '@/Utils/dateFormatter';

export default function Show({ member }) {
    const getStatusColor = (status) => {
        switch (status) {
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

    const getStatusLabel = (status) => {
        switch (status) {
            case 'menunggu_persetujuan':
                return '⏳ Menunggu Persetujuan';
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

    return (
        <AuthenticatedLayout header="Detail Informasi Member">
            <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Large Avatar */}
                    <div className="shrink-0">
                        {member.foto ? (
                            <img
                                src={member.foto}
                                alt={member.name}
                                className="w-40 h-40 rounded-full object-cover border-4 border-slate-100 shadow-md"
                            />
                        ) : (
                            <div className="w-40 h-40 rounded-full bg-blue-100 border-4 border-slate-100 shadow-md flex items-center justify-center text-blue-700 text-5xl font-black select-none">
                                {member.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Member Details */}
                    <div className="flex-1 space-y-4 text-center md:text-left w-full">
                        <div>
                            <span className="bg-green-100 text-green-800 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                                Member Aktif
                            </span>
                            <h2 className="text-2xl font-bold text-slate-800 mt-2">{member.name}</h2>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{member.email}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-150">
                            <div>
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">No. Identitas (KTP)</p>
                                <p className="font-bold text-slate-700 text-sm mt-0.5">{member.no_identitas || '-'}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">No. Telepon / WA</p>
                                <p className="font-bold text-slate-700 text-sm mt-0.5">{member.no_telp || '-'}</p>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3 justify-center md:justify-start">
                            <a
                                href={`/members/${member.id}/edit`}
                                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg transition shadow-sm"
                            >
                                ✏️ Edit Profil
                            </a>
                            <a
                                href="/members"
                                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 transition"
                            >
                                Kembali ke Daftar
                            </a>
                        </div>
                    </div>
                </div>

                {/* Borrowing History */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">📋 Riwayat Aktivitas Peminjaman</h3>
                        <p className="text-slate-500 text-sm mt-0.5">Daftar seluruh transaksi peminjaman buku yang dilakukan oleh member ini.</p>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                        <table className="w-full min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-8 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-16">ID</th>
                                    <th className="px-8 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Buku yang Dipinjam</th>
                                    <th className="px-8 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tgl Pinjam</th>
                                    <th className="px-8 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Batas Kembali</th>
                                    <th className="px-10 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-36">Status</th>
                                    <th className="px-10 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Struk</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {member.peminjamans && member.peminjamans.length > 0 ? (
                                    member.peminjamans.map((loan) => (
                                        <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-4 text-xs font-bold text-slate-800">
                                                #{loan.id}
                                            </td>
                                            <td className="px-8 py-4">
                                                <ul className="space-y-1">
                                                    {loan.detail_peminjaman?.map(detail => (
                                                        <li key={detail.id} className="text-xs font-bold text-slate-800">
                                                            • {detail.buku?.judul || 'Buku'}
                                                            <span className="text-[10px] text-slate-400 font-normal ml-1">({detail.buku?.penulis})</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-8 py-4 text-xs text-slate-600 font-medium">
                                                {formatDate(loan.tgl_peminjaman)}
                                            </td>
                                            <td className="px-8 py-4 text-xs text-slate-600 font-medium">
                                                {loan.batas_tgl_peminjaman ? formatDate(loan.batas_tgl_peminjaman) : '-'}
                                            </td>
                                            <td className="px-10 py-4 text-center">
                                                <span className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-black ${getStatusColor(loan.status_peminjaman)}`}>
                                                    {getStatusLabel(loan.status_peminjaman)}
                                                </span>
                                            </td>
                                            <td className="px-10 py-4 text-center">
                                                {loan.struk ? (
                                                    <a
                                                        href={`/struks/${loan.struk.id}/download`}
                                                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold rounded border border-blue-200 transition"
                                                    >
                                                        📥 PDF
                                                    </a>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 font-semibold">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-450 text-xs">
                                            Member ini belum memiliki riwayat peminjaman buku.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
