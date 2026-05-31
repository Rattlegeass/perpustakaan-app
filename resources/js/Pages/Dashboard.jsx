import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { formatDate } from '@/Utils/dateFormatter';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard({ role, adminData, memberData }) {
    return (
        <AuthenticatedLayout
            header={`📊 Dashboard ${role === 'admin' ? 'Librarian' : 'Member'}`}
        >
            <Head title="Dashboard" />

            {role === 'admin' ? (
                <AdminDashboard data={adminData} />
            ) : (
                <MemberDashboard data={memberData} />
            )}
        </AuthenticatedLayout>
    );
}

// -------------------------------------------------------------
// ADMIN DASHBOARD COMPONENT
// -------------------------------------------------------------
function AdminDashboard({ data }) {
    const chartData = {
        labels: data.monthlyFines.map(item => item.month_name),
        datasets: [
            {
                label: 'Total Denda Terkumpul (Rp)',
                data: data.monthlyFines.map(item => item.total),
                backgroundColor: 'rgba(11, 58, 96, 0.85)',
                borderColor: 'rgba(11, 58, 96, 1)',
                borderWidth: 1,
                borderRadius: 8,
                barPercentage: 0.6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Rp ${new Intl.NumberFormat('id-ID').format(context.parsed.y)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return 'Rp ' + new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value);
                    }
                }
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Welcome Admin Banner */}
            <div className="bg-gradient-to-r from-[#0B3A60] to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4">
                    <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                </div>
                <div className="relative z-10 space-y-2">
                    <span className="bg-yellow-400/20 text-yellow-300 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Librarian Mode</span>
                    <h1 className="text-3xl font-black">Selamat Datang Kembali, Admin!</h1>
                    <p className="opacity-90 max-w-xl text-sm">Semua data perpustakaan, aktivitas peminjaman anggota, dan tagihan denda terangkum di sini secara real-time.</p>
                </div>
            </div>

            {/* Pending Attention Alerts */}
            {(data.pendingApprovals > 0 || data.pendingPickups > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.pendingApprovals > 0 && (
                        <Link
                            href={route('peminjamans.index')}
                            className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition group"
                        >
                            <div className="w-12 h-12 bg-yellow-100 text-yellow-800 rounded-xl flex items-center justify-center text-xl font-bold">⏳</div>
                            <div>
                                <h4 className="font-bold text-yellow-900 text-sm">Menunggu Persetujuan</h4>
                                <p className="text-xs text-yellow-700 mt-0.5">Ada <span className="font-black text-yellow-900">{data.pendingApprovals} peminjaman</span> buku menunggu persetujuan Anda. Klik untuk verifikasi.</p>
                            </div>
                        </Link>
                    )}
                    {data.pendingPickups > 0 && (
                        <Link
                            href={route('peminjamans.index')}
                            className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition group"
                        >
                            <div className="w-12 h-12 bg-orange-100 text-orange-800 rounded-xl flex items-center justify-center text-xl font-bold">📦</div>
                            <div>
                                <h4 className="font-bold text-orange-900 text-sm">Siap Diambil Member</h4>
                                <p className="text-xs text-orange-700 mt-0.5">Ada <span className="font-black text-orange-900">{data.pendingPickups} buku</span> disetujui yang belum diambil member. Klik untuk konfirmasi.</p>
                            </div>
                        </Link>
                    )}
                </div>
            )}

            {/* Summary Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                {/* Total Buku */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <span className="text-2xl">📚</span>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mt-3">Total Buku</p>
                    </div>
                    <p className="text-3xl font-black text-slate-800 mt-2">{data.totalBooks} <span className="text-sm font-semibold text-slate-400">eks</span></p>
                </div>

                {/* Total Peminjaman */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <span className="text-2xl">📋</span>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mt-3">Total Transaksi</p>
                    </div>
                    <p className="text-3xl font-black text-slate-800 mt-2">{data.totalBorrowings} <span className="text-sm font-semibold text-slate-400">kali</span></p>
                </div>

                {/* Peminjaman Aktif */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <span className="text-2xl">📖</span>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mt-3">Sedang Dipinjam</p>
                    </div>
                    <p className="text-3xl font-black text-blue-600 mt-2">{data.activeLoans} <span className="text-sm font-semibold text-slate-400">buku</span></p>
                </div>

                {/* Denda Lunas */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <span className="text-2xl">💰</span>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mt-3">Denda Lunas</p>
                    </div>
                    <p className="text-xl font-black text-green-600 mt-2">Rp {new Intl.NumberFormat('id-ID').format(data.finesCollected)}</p>
                </div>

                {/* Denda Unpaid */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <span className="text-2xl">⚠️</span>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mt-3">Denda Belum Bayar</p>
                    </div>
                    <p className="text-xl font-black text-red-600 mt-2">Rp {new Intl.NumberFormat('id-ID').format(data.finesUnpaid)}</p>
                </div>
            </div>

            {/* Quick Actions for Admin */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">⚡ Pintasan Cepat Admin</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Link
                        href={route('bukus.create')}
                        className="p-4 bg-blue-50 hover:bg-blue-100 text-[#0B3A60] font-bold rounded-xl text-center text-sm border border-blue-200 hover:shadow-sm transition"
                    >
                        ➕ Tambah Buku Baru
                    </Link>
                    <Link
                        href={route('peminjamans.index')}
                        className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-center text-sm border border-slate-200 hover:shadow-sm transition"
                    >
                        📋 Manajemen Peminjaman
                    </Link>
                    <Link
                        href={route('dendas.index')}
                        className="p-4 bg-green-50 hover:bg-green-100 text-green-800 font-bold rounded-xl text-center text-sm border border-green-200 hover:shadow-sm transition"
                    >
                        💵 Kelola Denda Anggota
                    </Link>
                </div>
            </div>

            {/* Visual Grid: Charts & Top Books */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Fines Chart */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-slate-800 text-base">📈 Grafik Pendapatan Denda Bulanan</h3>
                    <div className="h-64 relative flex items-center justify-center">
                        {data.monthlyFines.some(m => m.total > 0) ? (
                            <Bar data={chartData} options={chartOptions} />
                        ) : (
                            <div className="text-slate-400 text-sm text-center py-16">
                                <p>📊 Belum ada data denda tercatat di tahun ini.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Borrowed Books */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-800 text-base">🔥 Buku Terpopuler</h3>
                    {data.topBooks && data.topBooks.length > 0 ? (
                        <div className="space-y-3.5">
                            {data.topBooks.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-3 p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-[#0B3A60] text-yellow-400 font-black rounded-lg text-xs flex items-center justify-center">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-xs line-clamp-1">{item.buku?.judul || 'Buku'}</p>
                                            <p className="text-slate-400 text-[10px]">{item.buku?.penulis}</p>
                                        </div>
                                    </div>
                                    <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded-full shrink-0">
                                        🔥 {item.count}x pinjam
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-xs py-10 text-center">Belum ada transaksi pengembalian terhitung.</p>
                    )}
                </div>
            </div>

            {/* Recent Borrowing Activities */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-base">🔄 Aktivitas Peminjaman Terbaru</h3>
                    <Link href={route('peminjamans.index')} className="text-[#0B3A60] font-bold text-xs hover:underline">Lihat Semua ➜</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead className="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3.5 text-left">Member</th>
                                <th className="px-6 py-3.5 text-left">Buku</th>
                                <th className="px-6 py-3.5 text-left">Tgl Pinjam</th>
                                <th className="px-6 py-3.5 text-left">Tenggat Waktu</th>
                                <th className="px-6 py-3.5 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.recentLoans && data.recentLoans.length > 0 ? (
                                data.recentLoans.map((loan) => (
                                    <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                                        {/* User */}
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800 text-xs">{loan.user?.name}</div>
                                            <div className="text-slate-400 text-[10px] mt-0.5">{loan.user?.email}</div>
                                        </td>
                                        {/* Books */}
                                        <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                                            {loan.detail_peminjaman?.map(d => d.buku?.judul).join(', ') || '-'}
                                        </td>
                                        {/* Pinjam date */}
                                        <td className="px-6 py-4 text-xs font-medium text-slate-600">
                                            {formatDate(loan.tgl_peminjaman)}
                                        </td>
                                        {/* Return date */}
                                        <td className="px-6 py-4 text-xs font-medium text-slate-600">
                                            {loan.batas_tgl_peminjaman ? formatDate(loan.batas_tgl_peminjaman) : '-'}
                                        </td>
                                        {/* Status */}
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black ${
                                                loan.status_peminjaman === 'dikembalikan' ? 'bg-green-100 text-green-800' :
                                                loan.status_peminjaman === 'terlambat' ? 'bg-red-100 text-red-800' :
                                                loan.status_peminjaman === 'dipinjam' ? 'bg-blue-100 text-blue-800' :
                                                loan.status_peminjaman === 'ditolak' ? 'bg-rose-100 text-rose-800' :
                                                loan.status_peminjaman === 'menunggu_pengambilan' ? 'bg-orange-100 text-orange-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {loan.status_peminjaman.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400 text-xs">Belum ada peminjaman buku terdaftar.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// MEMBER DASHBOARD COMPONENT
// -------------------------------------------------------------
function MemberDashboard({ data }) {
    const user = usePage().props.auth.user;

    // Hitung countdown atau denda per peminjaman
    const getCountdownText = (loan) => {
        if (loan.status_peminjaman === 'menunggu_persetujuan') {
            return { text: '⏳ Menunggu Persetujuan', color: 'text-yellow-800 bg-yellow-100 border border-yellow-200 font-semibold' };
        }
        if (loan.status_peminjaman === 'menunggu_pengambilan') {
            return { text: '📦 Siap Diambil', color: 'text-orange-800 bg-orange-100 border border-orange-200 font-bold' };
        }
        if (!loan.batas_tgl_peminjaman) return { text: '⏳ Menunggu Persetujuan', color: 'text-slate-500 bg-slate-100' };

        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const due = new Date(loan.batas_tgl_peminjaman);
        due.setHours(0, 0, 0, 0);

        const diffTime = due - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { text: `⏰ Terlambat ${Math.abs(diffDays)} hari!`, color: 'text-red-700 bg-red-100 border border-red-200 animate-pulse font-bold' };
        } else if (diffDays === 0) {
            return { text: '⏰ Hari ini batas pengembalian!', color: 'text-orange-700 bg-orange-100 border border-orange-200 font-bold' };
        } else if (diffDays <= 2) {
            return { text: `⏳ Sisa ${diffDays} hari lagi!`, color: 'text-amber-700 bg-amber-100 border border-amber-200 font-semibold' };
        }
        return { text: `✅ Sisa ${diffDays} hari`, color: 'text-green-700 bg-green-100 border border-green-200' };
    };

    return (
        <div className="space-y-8">
            {/* Welcome Member Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4">
                    <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                    </svg>
                </div>
                <div className="relative z-10 space-y-2">
                    <span className="bg-white/20 text-yellow-300 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Member Dashboard</span>
                    <h1 className="text-3xl font-black">Halo, {user.name}!</h1>
                    <p className="opacity-90 max-w-xl text-sm">"Membuka buku adalah membuka jendela dunia." Mari periksa buku pinjaman Anda hari ini dan jelajahi bacaan seru lainnya.</p>
                </div>
            </div>

            {/* Summary Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Active Loans */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <span className="text-2xl">📖</span>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mt-3">Sedang Dipinjam</p>
                    </div>
                    <p className="text-3xl font-black text-blue-600 mt-2">{data.activeLoansCount} <span className="text-sm font-semibold text-slate-400">buku</span></p>
                </div>

                {/* Total Loans History */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <span className="text-2xl">📚</span>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mt-3">Total Riwayat Baca</p>
                    </div>
                    <p className="text-3xl font-black text-slate-800 mt-2">{data.totalLoansCount} <span className="text-sm font-semibold text-slate-400">buku</span></p>
                </div>

                {/* Unpaid Fines */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <span className="text-2xl">⚠️</span>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mt-3">Tagihan Denda</p>
                    </div>
                    <p className="text-xl font-black text-red-600 mt-2">Rp {new Intl.NumberFormat('id-ID').format(data.unpaidFinesSum)}</p>
                </div>

                {/* Paid Fines */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <span className="text-2xl">✅</span>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mt-3">Denda Dilunasi</p>
                    </div>
                    <p className="text-xl font-black text-green-600 mt-2">Rp {new Intl.NumberFormat('id-ID').format(data.paidFinesSum)}</p>
                </div>
            </div>

            {/* Grid Layout: Active Borrowings vs Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Borrowing Cards */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="font-bold text-slate-800 text-base">📖 Buku yang Sedang Anda Pinjam</h3>
                        <Link href={route('peminjamans.member')} className="text-[#0B3A60] font-bold text-xs hover:underline">Riwayat Pinjam ➜</Link>
                    </div>

                    <div className="space-y-4">
                        {data.myLoans && data.myLoans.some(l => l.status_peminjaman !== 'dikembalikan' && l.status_peminjaman !== 'ditolak') ? (
                            data.myLoans
                                .filter(l => l.status_peminjaman !== 'dikembalikan' && l.status_peminjaman !== 'ditolak')
                                .map((loan) => (
                                    <div key={loan.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[9px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-black uppercase">Transaksi #{loan.id}</span>
                                            <ul className="space-y-1 mt-1.5">
                                                {loan.detail_peminjaman?.map(detail => (
                                                    <li key={detail.id} className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                        <span>•</span> {detail.buku?.judul}
                                                        <span className="text-[10px] font-normal text-slate-500">by {detail.buku?.penulis}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="flex items-center gap-4 text-[10px] text-slate-500 font-semibold pt-1">
                                                <span>📅 Pinjam: {formatDate(loan.tgl_peminjaman)}</span>
                                                {loan.batas_tgl_peminjaman && (
                                                    <span>📅 Kembali: {formatDate(loan.batas_tgl_peminjaman)}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="shrink-0 flex items-center md:flex-col gap-3 justify-between">
                                            {(() => {
                                                const countdown = getCountdownText(loan);
                                                return (
                                                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${countdown.color}`}>
                                                        {countdown.text}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="text-center py-16 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-slate-400 text-sm">📭 Anda tidak memiliki peminjaman buku yang sedang aktif.</p>
                                <Link
                                    href="/daftar-buku"
                                    className="mt-4 inline-block px-5 py-2 bg-[#0B3A60] hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition"
                                >
                                    Cari Buku & Pinjam Sekarang!
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-800 text-base">📚 Rekomendasi Buku Baru</h3>
                    <div className="space-y-4">
                        {data.bookRecommendations && data.bookRecommendations.length > 0 ? (
                            data.bookRecommendations.map((book) => (
                                <div key={book.id} className="flex gap-4 p-3 bg-slate-50/50 hover:bg-blue-50/20 rounded-xl border border-slate-100 transition">
                                    {/* Small Book Visual Cover */}
                                    {book.cover ? (
                                        <div className="overflow-hidden rounded-lg w-16 h-16 shrink-0 shadow-sm">
                                            <img src={book.cover} alt={book.judul} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 bg-blue-100 rounded-lg shrink-0 flex items-center justify-center text-xl shadow-sm border border-blue-200/50">
                                            📖
                                        </div>
                                    )}
                                    <div className="space-y-1 select-none">
                                        <h4 className="font-bold text-slate-800 text-xs leading-snug line-clamp-1">{book.judul}</h4>
                                        <p className="text-slate-400 text-[10px]">{book.penulis}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="bg-green-100 text-green-800 text-[9px] px-2 py-0.5 rounded-full font-bold">
                                                Tersedia: {book.stok}
                                            </span>
                                            <span className="text-[9px] text-slate-400 capitalize">{book.kategori}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-xs py-10 text-center">Buku tidak tersedia saat ini.</p>
                        )}
                        <Link
                            href="/daftar-buku"
                            className="block w-full text-center px-4 py-2.5 border border-[#0B3A60] text-[#0B3A60] hover:bg-[#0B3A60] hover:text-white font-bold rounded-lg text-xs transition"
                        >
                            🔍 Lihat Seluruh Koleksi Buku
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}