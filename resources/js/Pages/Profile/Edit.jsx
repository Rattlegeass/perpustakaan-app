import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
// 👇 Import komponen DeleteUserForm buatan kita 👇
import DeleteUserForm from './Partials/DeleteUserForm';

export default function Show({ auth }) {
    const getInitials = (name) => {
        if (!name) return 'U';
        const words = name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getFotoUrl = (foto) => {
        if (!foto) return null;
        if (foto.startsWith('/storage/') || foto.startsWith('http')) return foto;
        return `/storage/${foto}`;
    };

    const fotoUrl = getFotoUrl(auth.user.foto);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profil Saya
                </h2>
            }
        >
            <Head title="Profil Saya" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">

                    <div className="flex flex-col gap-6">
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Informasi Pribadi
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Informasi detail akun Anda
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link
                                        href={route('profile.edit')}
                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-[1.03] hover:bg-[#EFF6FF] hover:text-blue-600 active:scale-[0.97]"
                                    >
                                        <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="h-4 w-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                        Edit Profil
                                    </Link>

                                    {/* 👇 Panggil komponennya persis di sebelah tombol Edit Profil 👇 */}
                                    <DeleteUserForm />
                                </div>
                            </div>

                            {/* FOTO DAN NAMA SINGKAT */}
                            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-6">
                                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-50 shadow-md transition-transform duration-200 hover:scale-105">
                                    {fotoUrl ? (
                                        <img src={fotoUrl} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-blue-600">
                                            {getInitials(auth.user.name)}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4 text-center sm:mt-0 sm:text-left">
                                    <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
                                        <h4 className="text-xl font-bold text-gray-900">{auth.user.name}</h4>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                            <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="h-3.5 w-3.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                            </svg>
                                            Anggota Aktif
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Bergabung sejak {new Date(auth.user.created_at || Date.now()).getFullYear()}
                                    </p>
                                </div>
                            </div>

                            {/* DETAIL INFORMASI */}
                            <div className="mt-8 rounded-xl bg-gray-50/50 p-6">
                                <dl className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                                    <div className="flex flex-col gap-1">
                                        <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            Nama Lengkap
                                        </dt>
                                        <dd className="text-base font-semibold text-gray-900">{auth.user.name}</dd>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            Alamat Email
                                        </dt>
                                        <dd className="text-base font-semibold text-gray-900">{auth.user.email}</dd>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            No. Telepon
                                        </dt>
                                        <dd className="text-base font-semibold text-gray-900">{auth.user.no_telp || 'Belum ditambahkan'}</dd>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            No. Identitas
                                        </dt>
                                        <dd className="text-base font-semibold text-gray-900">{auth.user.no_identitas || 'Belum ditambahkan'}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}