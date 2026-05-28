import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ bukus, users }) {
    const [errors, setErrors] = useState({});
    const [selectedBukus, setSelectedBukus] = useState([]);
    const [currentBukuId, setCurrentBukuId] = useState('');

    const { data, setData, processing } = useForm({
        user_id: '',
        buku_ids: [],
        batas_tgl_peminjaman: '',
    });

    const handleAddBuku = () => {
        if (!currentBukuId) return;
        const bId = parseInt(currentBukuId);
        if (selectedBukus.some(b => b.id === bId)) {
            return;
        }
        const book = bukus.find(b => b.id === bId);
        if (book) {
            const updated = [...selectedBukus, book];
            setSelectedBukus(updated);
            setData('buku_ids', updated.map(b => b.id));
            setCurrentBukuId('');
        }
    };

    const handleRemoveBuku = (id) => {
        const updated = selectedBukus.filter(b => b.id !== id);
        setSelectedBukus(updated);
        setData('buku_ids', updated.map(b => b.id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/peminjamans', data, {
            onError: (errors) => {
                setErrors(errors);
            },
        });
    };

    return (
        <AuthenticatedLayout header="Buat Peminjaman Baru">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="mb-6">
                    <label className="block mb-2 font-semibold text-slate-700">Pilih Member</label>
                    <select
                        value={data.user_id}
                        onChange={(e) => setData('user_id', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg transition ${errors.user_id ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                    >
                        <option value="">-- Pilih Member --</option>
                        {users?.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                    {errors.user_id && <div className="text-red-500 text-sm mt-2">{errors.user_id}</div>}
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold text-slate-700">Pilih Buku</label>
                    <div className="flex gap-3 mb-4">
                        <select
                            value={currentBukuId}
                            onChange={(e) => setCurrentBukuId(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">-- Pilih Buku --</option>
                            {bukus?.map((buku) => (
                                <option key={buku.id} value={buku.id} disabled={buku.stok <= 0}>
                                    {buku.judul} - Stok: {buku.stok} {buku.stok <= 0 ? '(Habis)' : ''}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={handleAddBuku}
                            className="bg-[#0B3A60] text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                        >
                            + Tambah
                        </button>
                    </div>

                    {selectedBukus.length > 0 ? (
                        <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b text-slate-600 font-semibold">
                                    <tr>
                                        <th className="px-4 py-2.5 text-left">Judul</th>
                                        <th className="px-4 py-2.5 text-left">Penulis</th>
                                        <th className="px-4 py-2.5 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedBukus.map((buku) => (
                                        <tr key={buku.id} className="border-b last:border-0 hover:bg-slate-50">
                                            <td className="px-4 py-2.5 font-medium text-slate-800">{buku.judul}</td>
                                            <td className="px-4 py-2.5 text-slate-600">{buku.penulis}</td>
                                            <td className="px-4 py-2.5 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveBuku(buku.id)}
                                                    className="text-red-600 hover:text-red-800 font-bold"
                                                >
                                                    🗑️ Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm italic mb-4">Belum ada buku yang ditambahkan ke daftar peminjaman.</p>
                    )}
                    {errors.buku_ids && <div className="text-red-500 text-sm mt-2">{errors.buku_ids}</div>}
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold text-slate-700">Batas Tanggal Pengembalian</label>
                    <input
                        type="date"
                        value={data.batas_tgl_peminjaman}
                        onChange={(e) => setData('batas_tgl_peminjaman', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg transition ${errors.batas_tgl_peminjaman ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                    />
                    {errors.batas_tgl_peminjaman && <div className="text-red-500 text-sm mt-2">{errors.batas_tgl_peminjaman}</div>}
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                        {processing ? 'Menyimpan...' : 'Buat Peminjaman'}
                    </button>
                    <a
                        href="/peminjamans"
                        className="bg-slate-500 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-slate-600 transition"
                    >
                        Batal
                    </a>
                </div>
            </form>
            </div>
        </AuthenticatedLayout>
    );
}
