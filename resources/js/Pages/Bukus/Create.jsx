import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create() {
    const [errors, setErrors] = useState({});
    const { data, setData, processing } = useForm({
        judul: '',
        penulis: '',
        penerbit: '',
        tahun_terbit: new Date().getFullYear(),
        stok: '',
        kategori: '',
        cover: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/bukus', data, {
            onError: (errors) => {
                setErrors(errors);
            },
        });
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Tambah Buku Baru</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
                <div className="mb-6">
                    <label className="block mb-2 font-semibold">Judul</label>
                    <input
                        type="text"
                        value={data.judul}
                        onChange={(e) => setData('judul', e.target.value)}
                        className={`w-full p-2 border rounded ${errors.judul ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan judul buku"
                    />
                    {errors.judul && <div className="text-red-500 text-sm mt-1">{errors.judul}</div>}
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold">Penulis</label>
                    <input
                        type="text"
                        value={data.penulis}
                        onChange={(e) => setData('penulis', e.target.value)}
                        className={`w-full p-2 border rounded ${errors.penulis ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan nama penulis"
                    />
                    {errors.penulis && <div className="text-red-500 text-sm mt-1">{errors.penulis}</div>}
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold">Penerbit</label>
                    <input
                        type="text"
                        value={data.penerbit}
                        onChange={(e) => setData('penerbit', e.target.value)}
                        className={`w-full p-2 border rounded ${errors.penerbit ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan nama penerbit"
                    />
                    {errors.penerbit && <div className="text-red-500 text-sm mt-1">{errors.penerbit}</div>}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block mb-2 font-semibold">Tahun Terbit</label>
                        <input
                            type="number"
                            value={data.tahun_terbit}
                            onChange={(e) => setData('tahun_terbit', e.target.value)}
                            className={`w-full p-2 border rounded ${errors.tahun_terbit ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.tahun_terbit && <div className="text-red-500 text-sm mt-1">{errors.tahun_terbit}</div>}
                    </div>
                    <div>
                        <label className="block mb-2 font-semibold">Stok</label>
                        <input
                            type="number"
                            value={data.stok}
                            onChange={(e) => setData('stok', e.target.value)}
                            className={`w-full p-2 border rounded ${errors.stok ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Jumlah stok"
                        />
                        {errors.stok && <div className="text-red-500 text-sm mt-1">{errors.stok}</div>}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold">Kategori</label>
                    <input
                        type="text"
                        value={data.kategori}
                        onChange={(e) => setData('kategori', e.target.value)}
                        className={`w-full p-2 border rounded ${errors.kategori ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Contoh: Fiksi, Non-fiksi, Referensi"
                    />
                    {errors.kategori && <div className="text-red-500 text-sm mt-1">{errors.kategori}</div>}
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Tambah Buku'}
                    </button>
                    <a
                        href="/bukus"
                        className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                    >
                        Batal
                    </a>
                </div>
            </form>
        </div>
    );
}
