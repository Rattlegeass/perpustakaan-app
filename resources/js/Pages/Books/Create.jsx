import { useForm } from '@inertiajs/react';

export default function Create() {

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        author: '',
        publisher: '',
        publish_year: '',
        stock: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post('/books');
    };

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-4">
                Tambah Buku
            </h1>

            <form onSubmit={submit} className="space-y-4">

                <input
                    type="text"
                    placeholder="Judul"
                    className="border p-2 w-full"
                    onChange={(e) => setData('title', e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Author"
                    className="border p-2 w-full"
                    onChange={(e) => setData('author', e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Publisher"
                    className="border p-2 w-full"
                    onChange={(e) => setData('publisher', e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Tahun"
                    className="border p-2 w-full"
                    onChange={(e) => setData('publish_year', e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Stock"
                    className="border p-2 w-full"
                    onChange={(e) => setData('stock', e.target.value)}
                />

                <button
                    disabled={processing}
                    className="bg-blue-500 text-white px-4 py-2"
                >
                    Simpan
                </button>

            </form>
        </div>
    );
}