import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ bukus, users }) {
    const [errors, setErrors] = useState({});
    const { data, setData, processing } = useForm({
        user_id: '',
        buku_id: '',
        batas_tgl_peminjaman: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/peminjamans', data, {
            onError: (errors) => {
                setErrors(errors);
            },
        });
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Buat Peminjaman Baru</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
                <div className="mb-6">
                    <label className="block mb-2 font-semibold">Pilih User</label>
                    <select
                        value={data.user_id}
                        onChange={(e) => setData('user_id', e.target.value)}
                        className={`w-full p-2 border rounded ${errors.user_id ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">-- Pilih User --</option>
                        {users?.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                    {errors.user_id && <div className="text-red-500 text-sm mt-1">{errors.user_id}</div>}
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold">Pilih Buku</label>
                    <select
                        value={data.buku_id}
                        onChange={(e) => setData('buku_id', e.target.value)}
                        className={`w-full p-2 border rounded ${errors.buku_id ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">-- Pilih Buku --</option>
                        {bukus?.map((buku) => (
                            <option key={buku.id} value={buku.id}>
                                {buku.judul} - Stok: {buku.stok}
                            </option>
                        ))}
                    </select>
                    {errors.buku_id && <div className="text-red-500 text-sm mt-1">{errors.buku_id}</div>}
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold">Batas Tanggal Pengembalian</label>
                    <input
                        type="date"
                        value={data.batas_tgl_peminjaman}
                        onChange={(e) => setData('batas_tgl_peminjaman', e.target.value)}
                        className={`w-full p-2 border rounded ${errors.batas_tgl_peminjaman ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.batas_tgl_peminjaman && <div className="text-red-500 text-sm mt-1">{errors.batas_tgl_peminjaman}</div>}
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Buat Peminjaman'}
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
