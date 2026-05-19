import { router } from '@inertiajs/react';

export default function Index({ borrowings }) {

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-4">
                Data Peminjaman
            </h1>

            <a
                href="/borrowings/create"
                className="bg-blue-500 text-white px-4 py-2 inline-block mb-4"
            >
                Pinjam Buku
            </a>

            <table className="w-full border">

                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Peminjam</th>
                        <th className="border p-2">Buku</th>
                        <th className="border p-2">Tanggal</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Action</th>
                    </tr>
                </thead>

                <tbody>

                    {borrowings.map((item) => (

                        <tr key={item.id}>

                            <td className="border p-2">
                                {item.borrower.name}
                            </td>

                            <td className="border p-2">

                                {item.details.map((detail) => (
                                    <div key={detail.id}>
                                        {detail.book.title}
                                    </div>
                                ))}

                            </td>

                            <td className="border p-2">
                                {item.borrow_date}
                            </td>

                            <td className="border p-2">
                                {item.status}
                            </td>

                            <td className="border p-2">
                                {item.status === 'borrowed' && (
                                    <button
                                        onClick={() =>
                                            router.post(
                                                `/borrowings/${item.id}/return`
                                            )
                                        }
                                        className="bg-green-500 text-white px-3 py-1"
                                    >
                                        Return
                                    </button>
                                )}
                            </td>
                        </tr>

                    ))}

                </tbody>

            </table>
        </div>
    );
}