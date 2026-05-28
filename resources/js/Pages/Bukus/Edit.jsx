import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react'; // Hapus 'router' karena kita pakai fungsi dari useForm
import { useState } from 'react';

export default function Edit({ buku }) {
    const [errors, setErrors] = useState({});
    
    // 1. Ambil fungsi 'post' dari useForm
    const { data, setData, post, processing } = useForm({
        _method: 'put', // 2. WAJIB TAMBAHKAN INI UNTUK EDIT FILE
        judul: buku.judul,
        penulis: buku.penulis,
        penerbit: buku.penerbit,
        tahun_terbit: buku.tahun_terbit,
        stok: buku.stok,
        kategori: buku.kategori,
        sinopsis: buku.sinopsis || '',
        cover: null, // Siapkan state untuk cover baru
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 3. Ubah menjadi post (bukan put), Inertia akan otomatis merubahnya jadi PUT berkat _method di atas
        post(`/bukus/${buku.id}`, {
            forceFormData: true, // Wajib diaktifkan agar gambar terkirim
            onError: (errors) => {
                setErrors(errors);
            },
        });
    };

    return (
        <AuthenticatedLayout header="Edit Buku">
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

                {/* Input Cover Buku */}
                <div className="mb-6">
                    <label className="block mb-2 font-semibold text-slate-700">Cover Buku</label>
                    
                    {/* Opsional: Tampilkan gambar lama jika ada */}
                    {buku.cover && !data.cover && (
                        <div className="mb-3">
                            <p className="text-xs text-slate-500 mb-1">Cover saat ini:</p>
                            <img src={buku.cover} alt="Cover Lama" className="w-24 h-32 object-cover rounded shadow-sm border border-slate-200" />
                        </div>
                    )}
                    
                    <input
                        type="file"
                        accept="image/*"
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
                        {processing ? 'Menyimpan...' : 'Update Buku'}
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