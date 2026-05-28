import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
        sinopsis: '',
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
        <AuthenticatedLayout header="Tambah Buku Baru">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="mb-6">
                    <label className="block mb-2 font-semibold text-slate-700">Judul</label>
                    <input
                        type="text"
                        value={data.judul}
                        onChange={(e) => setData('judul', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg transition ${errors.judul ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                        placeholder="Masukkan judul buku"
                    />
                    {errors.judul && <div className="text-red-500 text-sm mt-2">{errors.judul}</div>}
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold text-slate-700">Penulis</label>
                    <input
                        type="text"
                        value={data.penulis}
                        onChange={(e) => setData('penulis', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg transition ${errors.penulis ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                        placeholder="Masukkan nama penulis"
                    />
                    {errors.penulis && <div className="text-red-500 text-sm mt-2">{errors.penulis}</div>}
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold text-slate-700">Penerbit</label>
                    <input
                        type="text"
                        value={data.penerbit}
                        onChange={(e) => setData('penerbit', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg transition ${errors.penerbit ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                        placeholder="Masukkan nama penerbit"
                    />
                    {errors.penerbit && <div className="text-red-500 text-sm mt-2">{errors.penerbit}</div>}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block mb-2 font-semibold text-slate-700">Tahun Terbit</label>
                        <input
                            type="number"
                            value={data.tahun_terbit}
                            onChange={(e) => setData('tahun_terbit', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg transition ${errors.tahun_terbit ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                        />
                        {errors.tahun_terbit && <div className="text-red-500 text-sm mt-2">{errors.tahun_terbit}</div>}
                    </div>
                    <div>
                        <label className="block mb-2 font-semibold text-slate-700">Stok</label>
                        <input
                            type="number"
                            value={data.stok}
                            onChange={(e) => setData('stok', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg transition ${errors.stok ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                            placeholder="Jumlah stok"
                        />
                        {errors.stok && <div className="text-red-500 text-sm mt-2">{errors.stok}</div>}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold text-slate-700">Kategori</label>
                    <select
                        value={data.kategori}
                        onChange={(e) => setData('kategori', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg transition ${errors.kategori ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                    >
                        <option value="">-- Pilih Kategori --</option>
                        <option value="fiksi">Fiksi</option>
                        <option value="non-fiksi">Non-Fiksi</option>
                    </select>
                    {errors.kategori && <div className="text-red-500 text-sm mt-2">{errors.kategori}</div>}
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold text-slate-700">Cover Buku</label>
                    <input
                        type="file"
                        onChange={(e) => setData('cover', e.target.files[0])}
                        className={`w-full px-4 py-2 border rounded-lg transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${errors.cover ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                    />
                    {errors.cover && <div className="text-red-500 text-sm mt-2">{errors.cover}</div>}
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold text-slate-700">Sinopsis</label>
                    <textarea
                        value={data.sinopsis}
                        onChange={(e) => setData('sinopsis', e.target.value)}
                        rows="4"
                        className={`w-full px-4 py-2 border rounded-lg transition ${errors.sinopsis ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                        placeholder="Deskripsi singkat tentang buku"
                    ></textarea>
                    {errors.sinopsis && <div className="text-red-500 text-sm mt-2">{errors.sinopsis}</div>}
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                        {processing ? 'Menyimpan...' : 'Tambah Buku'}
                    </button>
                    <a
                        href="/bukus"
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
