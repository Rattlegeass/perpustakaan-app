import { useForm } from '@inertiajs/react';

export default function Edit({ book }) {

    const { data, setData, put } = useForm({
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        publish_year: book.publish_year,
        stock: book.stock,
    });

    const submit = (e) => {
        e.preventDefault();

        put(`/books/${book.id}`);
    };

    return (
        <div className="p-6">

            <form onSubmit={submit} className="space-y-4">

                <input
                    type="text"
                    value={data.title}
                    className="border p-2 w-full"
                    onChange={(e) => setData('title', e.target.value)}
                />

                <input
                    type="text"
                    value={data.author}
                    className="border p-2 w-full"
                    onChange={(e) => setData('author', e.target.value)}
                />

                <button className="bg-yellow-500 text-white px-4 py-2">
                    Update
                </button>

            </form>
        </div>
    );
}