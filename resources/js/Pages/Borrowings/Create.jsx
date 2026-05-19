import { useForm } from '@inertiajs/react';

export default function Create({ books }) {

    const { data, setData, post } = useForm({
        book_id: '',
        due_date: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post('/borrowings');
    };

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-4">
                Peminjaman Buku
            </h1>

            <form onSubmit={submit} className="space-y-4">

                <select
                    className="border p-2 w-full"
                    onChange={(e) =>
                        setData('book_id', e.target.value)
                    }
                >
                    <option value="">
                        Pilih Buku
                    </option>

                    {books.map((book) => (
                        <option
                            key={book.id}
                            value={book.id}
                        >
                            {book.title} - Stock: {book.stock}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    className="border p-2 w-full"
                    onChange={(e) =>
                        setData('due_date', e.target.value)
                    }
                />

                <button
                    className="bg-blue-500 text-white px-4 py-2"
                >
                    Pinjam
                </button>

            </form>
        </div>
    );
}