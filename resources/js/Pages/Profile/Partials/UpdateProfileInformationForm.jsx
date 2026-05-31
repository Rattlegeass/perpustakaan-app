import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useState, useRef, useEffect } from 'react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, foto_url, className = '' }) {
    const user = usePage().props.auth.user;
    const fileInputRef = useRef(null); 

    const getFotoUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('blob:') || url.startsWith('http:') || url.startsWith('https:') || url.startsWith('/storage/')) {
            return url;
        }
        return `/storage/${url}`;
    };

    const [preview, setPreview] = useState(getFotoUrl(foto_url));

    useEffect(() => {
        setPreview(getFotoUrl(foto_url));
    }, [foto_url]);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        no_telp: user.no_telp || '', 
        no_identitas: user.no_identitas || '',
        foto: null,
        hapus_foto: false, 
        _method: 'PATCH',
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData(data => ({ ...data, foto: file, hapus_foto: false }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRemovePhoto = () => {
        setPreview(null); 
        setData(data => ({ ...data, foto: null, hapus_foto: true })); 
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; 
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
            onSuccess: () => {
                setData(data => ({ ...data, foto: null, hapus_foto: false }));
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; 
                }
            }
        });
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const words = name.split(' ');
        if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <section className={className}>
            <header className="hidden">
                
            </header>

            <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-gray-100">
                    <div className="shrink-0 flex justify-center">
                        <div className="relative group">
                           
                            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-50 shadow-lg ring-1 ring-gray-200 transition duration-300 group-hover:scale-105">
                                {preview ? (
                                    <img src={preview} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-5xl font-extrabold text-blue-600 tracking-tight">
                                        {getInitials(user.name)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-3 justify-center items-center sm:items-start">
                        <h3 className="text-lg font-bold text-gray-900 hidden sm:block">Foto Profil</h3>
                        
                        <div className="flex flex-wrap gap-3 mt-2 justify-center sm:justify-start">
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                            <button type="button" onClick={triggerFileSelect} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition">
                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 3 3m-3-3v12" />
                                </svg>
                                {preview ? 'Ubah Foto' : 'Unggah Foto Baru'}
                            </button>

                            {preview && (
                                <button type="button" onClick={handleRemovePhoto} className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition">
                                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                    Hapus
                                </button>
                            )}
                        </div>
                        <InputError message={errors.foto} />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        <TextInput
                            id="name"
                            className="block w-full pl-11 rounded-xl"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                    </div>
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.909A2.25 2.25 0 0 1 2.25 8.243V6.75m19.5 0V11.25" />
                            </svg>
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            className="block w-full pl-11 rounded-xl"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="no_telp" value="No. Telepon" />
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.496-4.196-7.092-7.092l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                            </div>
                            <TextInput
                                id="no_telp"
                                className="block w-full pl-11 rounded-xl"
                                value={data.no_telp}
                                onChange={(e) => setData('no_telp', e.target.value)}
                                autoComplete="tel"
                            />
                        </div>
                        <InputError className="mt-2" message={errors.no_telp} />
                    </div>

                    <div>
                        <InputLabel htmlFor="no_identitas" value="No. Identitas" />
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                                </svg>
                            </div>
                            <TextInput
                                id="no_identitas"
                                className="block w-full pl-11 rounded-xl"
                                value={data.no_identitas}
                                onChange={(e) => setData('no_identitas', e.target.value)}
                            />
                        </div>
                        <InputError className="mt-2" message={errors.no_identitas} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Alamat email Anda belum diverifikasi.{' '}
                            <Link href={route('verification.send')} method="post" as="button" className="underline text-sm text-blue-600 hover:text-blue-800">
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                Tautan verifikasi baru telah dikirimkan.
                            </div>
                        )}
                    </div>
                )}

                <div className="pt-6 mt-4">
                    <button 
                        type="submit" 
                        disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-800 px-8 py-3.5 text-base font-bold text-white shadow-md shadow-slate-800/20 transition-all hover:bg-slate-900 active:scale-[0.98] disabled:opacity-50" >
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </section>
    );
}