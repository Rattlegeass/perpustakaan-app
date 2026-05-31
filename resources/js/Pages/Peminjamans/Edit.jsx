import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { formatDate } from '@/Utils/dateFormatter';

export default function Edit({ peminjaman }) {
    const [errors, setErrors] = useState({});
    
    // Ambil daftar detail peminjaman yang saat ini berstatus 'dipinjam'
    const borrowedDetails = peminjaman.detail_peminjaman?.filter(d => d.status_buku === 'dipinjam') || [];

    // Inisialisasi formulir dengan daftar semua buku yang dipinjam, semuanya tercentang secara default
    const { data, setData, processing } = useForm({
        returns: borrowedDetails.map(detail => ({
            detail_peminjaman_id: detail.id,
            judul: detail.buku?.judul || '',
            penulis: detail.buku?.penulis || '',
            checked: true, // Tercentang otomatis demi efisiensi admin
            catatan_kondisi: '',
        })),
    });

    const handleCheckboxChange = (index) => {
        const updatedReturns = [...data.returns];
        updatedReturns[index].checked = !updatedReturns[index].checked;
        setData('returns', updatedReturns);
    };

    const handleConditionChange = (index, value) => {
        const updatedReturns = [...data.returns];
        updatedReturns[index].catatan_kondisi = value;
        setData('returns', updatedReturns);
    };

    const handleSelectAll = (checked) => {
        const updatedReturns = data.returns.map(item => ({
            ...item,
            checked: checked
        }));
        setData('returns', updatedReturns);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Filter hanya buku yang dicentang oleh admin
        const checkedReturns = data.returns.filter(item => item.checked);
        
        if (checkedReturns.length === 0) {
            setErrors({ returns: 'Silakan pilih setidaknya satu buku yang ingin dikembalikan.' });
            return;
        }

        setErrors({});

        // Kirim data ke backend menggunakan Inertia router.put
        router.put(`/peminjamans/${peminjaman.id}`, {
            returns: checkedReturns.map(item => ({
                detail_peminjaman_id: item.detail_peminjaman_id,
                catatan_kondisi: item.catatan_kondisi
            }))
        }, {
            onError: (errors) => {
                setErrors(errors);
            },
        });
    };

    const daysLeft = Math.ceil(
        (new Date(peminjaman.batas_tgl_peminjaman) - new Date()) / (1000 * 60 * 60 * 24)
    );

    const isOverdue = daysLeft < 0;

    return (
        <AuthenticatedLayout header="Konfirmasi Return Buku">
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {/* Kartu Informasi Transaksi */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 transition hover:shadow-xl duration-300">
                    <div className="flex items-center justify-between border-b pb-4 mb-6">
                        <h2 className="text-xl font-bold text-slate-800">📋 Rincian Transaksi Peminjaman</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            peminjaman.status_peminjaman === 'terlambat' ? 'bg-red-100 text-red-700' : 
                            peminjaman.status_peminjaman === 'ditolak' ? 'bg-rose-100 text-rose-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                            {peminjaman.status_peminjaman?.replace('_', ' ')?.toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Member</p>
                            <p className="font-bold text-slate-800 text-base">{peminjaman.user?.name}</p>
                            <p className="text-xs text-slate-400 font-mono">{peminjaman.user?.email}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Tanggal Pinjam</p>
                            <p className="font-bold text-slate-800">{formatDate(peminjaman.tgl_peminjaman)}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Batas Kembali</p>
                            <p className="font-bold text-slate-800">{formatDate(peminjaman.batas_tgl_peminjaman)}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Sisa Waktu</p>
                            <p className={`font-bold text-base flex items-center gap-1.5 ${isOverdue ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {isOverdue ? `⏰ ${Math.abs(daysLeft)} hari terlambat` : `✅ ${daysLeft} hari lagi`}
                            </p>
                        </div>
                    </div>

                    {isOverdue && (
                        <div className="mt-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-lg flex items-start gap-3">
                            <span className="text-rose-600 text-xl">⚠️</span>
                            <div>
                                <p className="font-bold text-rose-800">Perhatian: Keterlambatan Pengembalian!</p>
                                <p className="text-rose-700 text-sm mt-0.5">Anggota telah melewati batas waktu pengembalian. Denda sebesar Rp 5.000/hari per buku akan dihitung otomatis saat konfirmasi.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Formulir Konfirmasi Pengembalian Buku */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">✅ Konfirmasi Pengembalian Buku</h2>
                            <p className="text-slate-500 text-sm mt-0.5">Centang buku yang dikembalikan saat ini. Kolom catatan kondisi akan muncul di setiap buku yang dipilih.</p>
                        </div>
                        
                        {/* Tombol Aksi Massal */}
                        {data.returns.length > 1 && (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleSelectAll(true)}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                                >
                                    Pilih Semua
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSelectAll(false)}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                                >
                                    Batal Pilih Semua
                                </button>
                            </div>
                        )}
                    </div>

                    {errors.returns && (
                        <div className="p-4 bg-rose-50 text-rose-800 rounded-lg text-sm font-semibold">
                            ⚠️ {errors.returns}
                        </div>
                    )}

                    <div className="space-y-4">
                        {data.returns.map((item, index) => (
                            <div 
                                key={item.detail_peminjaman_id} 
                                className={`p-5 rounded-xl border transition-all duration-200 ${
                                    item.checked 
                                        ? 'border-emerald-200 bg-emerald-50/20 shadow-sm' 
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Checkbox Utama */}
                                    <input
                                        type="checkbox"
                                        id={`check-${item.detail_peminjaman_id}`}
                                        checked={item.checked}
                                        onChange={() => handleCheckboxChange(index)}
                                        className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                    />
                                    
                                    <div className="flex-1 space-y-3">
                                        <label 
                                            htmlFor={`check-${item.detail_peminjaman_id}`}
                                            className="block cursor-pointer"
                                        >
                                            <p className="font-bold text-slate-800 text-base">{item.judul}</p>
                                            <p className="text-slate-500 text-xs">Penulis: {item.penulis}</p>
                                        </label>

                                        {/* Input Catatan Kondisi (Hanya muncul jika buku dicentang) */}
                                        {item.checked && (
                                            <div className="pt-2 animate-fadeIn">
                                                <label className="block mb-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                    Catatan Kondisi Buku
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.catatan_kondisi}
                                                    onChange={(e) => handleConditionChange(index, e.target.value)}
                                                    placeholder="Contoh: Sangat baik, sampul sedikit robek, dsb."
                                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {data.returns.length === 0 && (
                            <div className="text-center py-8 text-slate-500 font-semibold border border-dashed rounded-xl">
                                Semua buku pada peminjaman ini sudah berhasil dikembalikan.
                            </div>
                        )}
                    </div>

                    {/* Tombol Aksi Formulir */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                        <button
                            type="submit"
                            disabled={processing || data.returns.length === 0}
                            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2"
                        >
                            {processing ? '⏳ Memproses...' : '✅ Konfirmasi Pengembalian'}
                        </button>
                        <a
                            href="/peminjamans"
                            className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition text-center"
                        >
                            Kembali ke Daftar
                        </a>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}