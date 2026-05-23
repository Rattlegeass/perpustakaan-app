import { Link, router } from '@inertiajs/react';

export default function Show({ buku }) {
    const handleDelete = () => {
        if(confirm('Apakah Anda yakin akan menghapus buku ini?')) {
            router.delete(`/bukus/${buku.id}`);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{buku.judul}</h1>
                <Link
                    href="/bukus"
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Kembali
                </Link>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        {buku.cover && (
                            <div className="bg-gray-200 h-64 rounded flex items-center justify-center mb-4">
                                <img src={buku.cover} alt={buku.judul} className="h-full object-cover rounded" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-gray-600 text-sm">Penulis</p>
                            <p className="font-semibold text-lg">{buku.penulis}</p>
                        </div>

                        <div>
                            <p className="text-gray-600 text-sm">Penerbit</p>
                            <p className="font-semibold">{buku.penerbit}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600 text-sm">Tahun Terbit</p>
                                <p className="font-semibold">{buku.tahun_terbit}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Kategori</p>
                                <p className="font-semibold">{buku.kategori}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-gray-600 text-sm">Stok Tersedia</p>
                            <p className={`font-bold text-2xl ${
                                buku.stok > 5 ? 'text-green-600' : 
                                buku.stok > 0 ? 'text-yellow-600' : 
                                'text-red-600'
                            }`}>
                                {buku.stok} eksemplar
                            </p>
                        </div>

                        <div className="pt-4 flex gap-2">
                            <a
                                href={`/bukus/${buku.id}/edit`}
                                className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
                            >
                                Edit
                            </a>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
