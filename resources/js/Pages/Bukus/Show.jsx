import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router } from '@inertiajs/react';

export default function Show({ buku }) {
    const handleDelete = () => {
        if(confirm('Apakah Anda yakin akan menghapus buku ini?')) {
            router.delete(`/bukus/${buku.id}`);
        }
    };

    return (
        <AuthenticatedLayout header={buku.judul}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                        {/* Cover */}
                        <div>
                            {buku.cover ? (
                                <img 
                                    src={buku.cover} 
                                    alt={buku.judul} 
                                    // Tambahkan aspect-[2/3] agar ukurannya sama persis dengan yang tidak ada cover
                                    className="w-full aspect-[2/3] rounded-xl object-cover shadow-md" 
                                />
                            ) : (
                                <div className="w-full aspect-[2/3] rounded-xl bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center text-4xl shadow-sm">
                                    📚
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <p className="text-slate-600 text-sm font-semibold uppercase">Penulis</p>
                                <p className="text-2xl font-bold text-slate-800">{buku.penulis}</p>
                            </div>

                            <div>
                                <p className="text-slate-600 text-sm font-semibold uppercase">Penerbit</p>
                                <p className="text-lg font-semibold text-slate-800">{buku.penerbit}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-slate-600 text-sm font-semibold uppercase">Tahun Terbit</p>
                                    <p className="text-lg font-semibold text-slate-800">{buku.tahun_terbit}</p>
                                </div>
                                <div>
                                    <p className="text-slate-600 text-sm font-semibold uppercase">Kategori</p>
                                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">{buku.kategori}</span>
                                </div>
                            </div>

                            <div className="border-t-2 border-slate-200 pt-6">
                                <p className="text-slate-600 text-sm font-semibold uppercase">Stok Tersedia</p>
                                <p className={`text-4xl font-bold mt-2 ${
                                    buku.stok > 5 ? 'text-green-600' : 
                                    buku.stok > 0 ? 'text-amber-600' : 
                                    'text-red-600'
                                }`}>
                                    {buku.stok}
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <a
                                    href={`/bukus/${buku.id}/edit`}
                                    className="flex-1 text-center bg-amber-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-amber-600 transition"
                                >
                                    Edit
                                </a>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition"
                                >
                                    Hapus
                                </button>
                                <Link
                                    href="/bukus"
                                    className="flex-1 text-center bg-slate-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-600 transition"
                                >
                                    Kembali
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sinopsis */}
                    {buku.sinopsis && (
                        <div className="border-t-2 border-slate-200 p-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Sinopsis</h2>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{buku.sinopsis}</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}