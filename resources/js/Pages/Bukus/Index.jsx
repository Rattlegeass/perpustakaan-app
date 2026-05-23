import { router } from '@inertiajs/react';

export default function Index({ bukus, filters }) {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Data Buku</h1>
            
            <a
                href="/bukus/create"
                className="bg-blue-500 text-white px-4 py-2 inline-block mb-6 hover:bg-blue-600 rounded"
            >
                + Tambah Buku
            </a>

            <input
                type="text"
                placeholder="Cari berdasarkan judul atau penulis..."
                defaultValue={filters?.search || ''}
                className="border border-gray-300 p-2 mb-6 w-full rounded"
                onChange={(e) => {
                    router.get(
                        '/bukus',
                        { search: e.target.value },
                        {
                            preserveState: true,
                            replace: true,
                        }
                    );
                }}
            />

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full">
                    <thead className="bg-gray-200 border-b">
                        <tr>
                            <th className="border p-3 text-left">No</th>
                            <th className="border p-3 text-left">Judul</th>
                            <th className="border p-3 text-left">Penulis</th>
                            <th className="border p-3 text-left">Penerbit</th>
                            <th className="border p-3 text-center">Tahun</th>
                            <th className="border p-3 text-center">Stok</th>
                            <th className="border p-3 text-left">Kategori</th>
                            <th className="border p-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bukus.data?.map((buku, index) => (
                            <tr key={buku.id} className="hover:bg-gray-50">
                                <td className="border p-3">{index + 1}</td>
                                <td className="border p-3">
                                    <div className="font-semibold">{buku.judul}</div>
                                    {buku.cover && (
                                        <div className="text-sm text-gray-500">
                                            📚 Cover tersedia
                                        </div>
                                    )}
                                </td>
                                <td className="border p-3">{buku.penulis}</td>
                                <td className="border p-3">{buku.penerbit}</td>
                                <td className="border p-3 text-center">{buku.tahun_terbit}</td>
                                <td className="border p-3 text-center">
                                    <span className={`inline-block px-3 py-1 rounded-full font-semibold ${
                                        buku.stok > 5 ? 'bg-green-100 text-green-800' : 
                                        buku.stok > 0 ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {buku.stok}
                                    </span>
                                </td>
                                <td className="border p-3">{buku.kategori}</td>
                                <td className="border p-3 text-center space-x-2">
                                    <a
                                        href={`/bukus/${buku.id}`}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 inline-block text-sm"
                                    >
                                        Lihat
                                    </a>
                                    <a
                                        href={`/bukus/${buku.id}/edit`}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 inline-block text-sm"
                                    >
                                        Edit
                                    </a>
                                    <button
                                        onClick={() => {
                                            if(confirm('Hapus buku ini?')) {
                                                router.delete(`/bukus/${buku.id}`);
                                            }
                                        }}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {bukus.data?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    Tidak ada data buku
                </div>
            )}

            <div className="mt-6 flex gap-2 justify-center">
                {bukus.links?.map((link, index) => (
                    <button
                        key={index}
                        disabled={!link.url}
                        onClick={() => router.visit(link.url)}
                        className={`px-3 py-1 border rounded ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        dangerouslySetInnerHTML={{
                            __html: link.label
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
