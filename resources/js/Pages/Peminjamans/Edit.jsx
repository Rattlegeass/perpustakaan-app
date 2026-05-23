import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ peminjaman }) {
    const [errors, setErrors] = useState({});
    const detail = peminjaman.detail_peminjaman?.[0]; // Assuming single book per borrow
    const { data, setData, processing } = useForm({
        detail_peminjaman_id: detail?.id || '',
        condition_notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/peminjamans/${peminjaman.id}`, data, {
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
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Return Buku</h1>

            <div className="bg-white p-6 rounded shadow mb-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-gray-600 text-sm">User</p>
                        <p className="font-semibold text-lg">{peminjaman.user?.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Email</p>
                        <p className="font-semibold">{peminjaman.user?.email}</p>
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
                        <p className="text-gray-600 text-sm">Buku</p>
                        <p className="font-semibold">{detail?.buku?.judul}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Status</p>
                        <p className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                            {isOverdue ? `Terlambat ${Math.abs(daysLeft)} hari` : `Sisa ${daysLeft} hari`}
                        </p>
                    </div>
                </div>

                {isOverdue && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <p className="font-bold">Perhatian: Buku Terlambat!</p>
                        <p>Denda akan otomatis dibuat berdasarkan jumlah hari keterlambatan.</p>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
                <div className="mb-6">
                    <label className="block mb-2 font-semibold">Detail Peminjaman</label>
                    <select
                        value={data.detail_peminjaman_id}
                        onChange={(e) => setData('detail_peminjaman_id', e.target.value)}
                        className={`w-full p-2 border rounded ${errors.detail_peminjaman_id ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">-- Pilih Detail Peminjaman --</option>
                        {peminjaman.detail_peminjaman?.map((detail) => (
                            <option key={detail.id} value={detail.id}>
                                {detail.buku?.judul} (Status: {detail.status_buku})
                            </option>
                        ))}
                    </select>
                    {errors.detail_peminjaman_id && <div className="text-red-500 text-sm mt-1">{errors.detail_peminjaman_id}</div>}
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold">Catatan Kondisi Buku</label>
                    <textarea
                        value={data.condition_notes}
                        onChange={(e) => setData('condition_notes', e.target.value)}
                        placeholder="Contoh: Sampul sedikit rusak, halaman lengkap"
                        rows="4"
                        className="w-full p-2 border border-gray-300 rounded"
                    ></textarea>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : 'Konfirmasi Return'}
                    </button>
                    <a
                        href="/peminjamans"
                        className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                    >
                        Batal
                    </a>
                </div>
            </form>
        </div>
    );
}
