import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create() {
    const [errors, setErrors] = useState({});
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, processing } = useForm({
        name: '',
        email: '',
        password: '',
        no_telp: '',
        no_identitas: '',
        foto: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('foto', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post('/members', {
            forceFormData: true, // Required for file uploads in Laravel
            onError: (errors) => {
                setErrors(errors);
            },
        });
    };

    return (
        <AuthenticatedLayout header="Pendaftaran Member Baru">
            <div className="max-w-3xl mx-auto px-4 py-6">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">👤 Formulir Anggota Baru</h3>
                        <p className="text-slate-500 text-sm mt-0.5">Lengkapi formulir berikut untuk mendaftarkan member perpustakaan baru.</p>
                    </div>

                    {/* Foto Profil / Avatar Uploader */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="shrink-0">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview Avatar"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-md flex items-center justify-center text-blue-700 text-3xl font-black select-none">
                                    👤
                                </div>
                            )}
                        </div>
                        <div className="space-y-2 text-center sm:text-left flex-1">
                            <label className="block text-sm font-bold text-slate-700">Foto Profil / Avatar</label>
                            <p className="text-xs text-slate-400">Pilih berkas gambar (JPG, PNG, JPEG, GIF) ukuran maks 2MB.</p>
                            <input
                                type="file"
                                id="avatar-upload"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="avatar-upload"
                                className="inline-block px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 shadow-sm cursor-pointer transition"
                            >
                                📷 Unggah Foto
                            </label>
                            {errors.foto && <div className="text-red-500 text-xs font-semibold mt-1">{errors.foto}</div>}
                        </div>
                    </div>

                    {/* Main Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0B3A60] ${
                                    errors.name ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                }`}
                                placeholder="Contoh: John Doe"
                            />
                            {errors.name && <div className="text-red-500 text-xs font-semibold">{errors.name}</div>}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0B3A60] ${
                                    errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                }`}
                                placeholder="Contoh: johndoe@gmail.com"
                            />
                            {errors.email && <div className="text-red-500 text-xs font-semibold">{errors.email}</div>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Kata Sandi (Password)</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0B3A60] ${
                                    errors.password ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                }`}
                                placeholder="Minimal 8 karakter"
                            />
                            {errors.password && <div className="text-red-500 text-xs font-semibold">{errors.password}</div>}
                        </div>

                        {/* No Identitas */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">No. Identitas (KTP/Kartu Pelajar)</label>
                            <input
                                type="text"
                                value={data.no_identitas}
                                onChange={(e) => setData('no_identitas', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0B3A60] ${
                                    errors.no_identitas ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                }`}
                                placeholder="Contoh: 3175123456789001"
                            />
                            {errors.no_identitas && <div className="text-red-500 text-xs font-semibold">{errors.no_identitas}</div>}
                        </div>

                        {/* No Telp */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">No. Telepon / WhatsApp</label>
                            <input
                                type="text"
                                value={data.no_telp}
                                onChange={(e) => setData('no_telp', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0B3A60] ${
                                    errors.no_telp ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                }`}
                                placeholder="Contoh: 081234567890"
                            />
                            {errors.no_telp && <div className="text-red-500 text-xs font-semibold">{errors.no_telp}</div>}
                        </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3 bg-[#0B3A60] text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm shadow-md text-center"
                        >
                            {processing ? '⏳ Memproses...' : '➕ Daftarkan Member'}
                        </button>
                        <a
                            href="/members"
                            className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition text-sm text-center border border-slate-200"
                        >
                            Batal
                        </a>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
