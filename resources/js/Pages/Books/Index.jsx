import { router } from '@inertiajs/react';

export default function Index({ books, filters }) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Data Buku
            </h1>
            <a
                href="/books/create"
                className="bg-blue-500 text-white px-4 py-2 inline-block mb-4"
            >
                Tambah Buku
            </a>
            <input
                type="text"
                placeholder="Search..."
                defaultValue={filters?.search || ''}
                className="border p-2 mb-4"
                onChange={(e) => {
                    router.get(
                        '/books',
                        { search: e.target.value },
                        {
                            preserveState: true,
                            replace: true,
                        }
                    );
                }}
            />

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Judul</th>
                        <th className="border p-2">Author</th>
                        <th className="border p-2">Stock</th>
                        <th className="border p-2">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {books.data?.map((book) => (
                        <tr key={book.id}>
                            <td className="border p-2">
                                {book.title}
                            </td>
                            <td className="border p-2">
                                {book.author}
                            </td>
                            <td className="border p-2">
                                {book.stock}
                            </td>
                            <td className="border p-2 space-x-2">
                                <a
                                    href={`/books/${book.id}/edit`}
                                    className="bg-yellow-500 text-white px-3 py-1.5"
                                >
                                    Edit
                                </a>
                                <button
                                    onClick={() => {
                                        if(confirm('Hapus buku?')) {
                                            router.delete(`/books/${book.id}`);
                                        }
                                    }}
                                    className="bg-red-500 text-white px-3 py-1"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex gap-2">
                {books.links.map((link, index) => (
                    <button
                        key={index}
                        disabled={!link.url}
                        onClick={() => router.visit(link.url)}
                        className="border px-3 py-1"
                        dangerouslySetInnerHTML={{
                            __html: link.label
                        }}
                    />
                ))}
            </div>
        </div>
    );
}