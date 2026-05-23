import { router } from '@inertiajs/react';

export default function Index({ peminjamans, filters }) {
    const getStatusColor = (status) => {
        switch(status) {
            case 'active':
                return 'bg-blue-100 text-blue-800';
            case 'returned':
                return 'bg-green-100 text-green-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'active':
                return 'Sedang Dipinjam';
            case 'returned':
                return 'Sudah Dikembalikan';
            case 'overdue':
                return 'Terlambat';
            default:
                return status;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Manajemen Peminjaman</h1>
            
            <a
                href="/peminjamans/create"
                className="bg-blue-500 text-white px-4 py-2 inline-block mb-6 hover:bg-blue-600 rounded"
            >
                + Buat Peminjaman Baru
            </a>

            <input
                type="text"
                placeholder="Cari berdasarkan tanggal, status, atau nama user..."
                defaultValue={filters?.search || ''}
                className="border border-gray-300 p-2 mb-6 w-full rounded"
                onChange={(e) => {
                    router.get(
                        '/peminjamans',
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
                            <th className="border p-3 text-left">User</th>
                            <th className="border p-3 text-left">Tgl Pinjam</th>
                            <th className="border p-3 text-left">Batas Kembali</th>
                            <th className="border p-3 text-left">Status</th>
                            <th className="border p-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {peminjamans.data?.map((pinjam, index) => (
                            <tr key={pinjam.id} className="hover:bg-gray-50">
                                <td className="border p-3">{index + 1}</td>
                                <td className="border p-3">
                                    <div className="font-semibold">{pinjam.user?.name}</div>
                                    <div className="text-sm text-gray-500">{pinjam.user?.email}</div>
                                </td>
                                <td className="border p-3">{pinjam.tgl_peminjaman}</td>
                                <td className="border p-3">{pinjam.batas_tgl_peminjaman}</td>
                                <td className="border p-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(pinjam.status_peminjaman)}`}>
                                        {getStatusLabel(pinjam.status_peminjaman)}
                                    </span>
                                </td>
                                <td className="border p-3 text-center space-x-2">
                                    <a
                                        href={`/peminjamans/${pinjam.id}`}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 inline-block text-sm"
                                    >
                                        Lihat
                                    </a>
                                    {pinjam.status_peminjaman === 'active' && (
                                        <a
                                            href={`/peminjamans/${pinjam.id}/edit`}
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 inline-block text-sm"
                                        >
                                            Return Buku
                                        </a>
                                    )}
                                    <button
                                        onClick={() => {
                                            if(confirm('Hapus peminjaman ini?')) {
                                                router.delete(`/peminjamans/${pinjam.id}`);
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

            {peminjamans.data?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    Tidak ada data peminjaman
                </div>
            )}

            <div className="mt-6 flex gap-2 justify-center">
                {peminjamans.links?.map((link, index) => (
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
