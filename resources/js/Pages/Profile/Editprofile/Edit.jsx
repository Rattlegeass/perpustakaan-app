import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import UpdatePasswordForm from '../Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from '../Partials/UpdateProfileInformationForm';
import { Transition } from '@headlessui/react';

export default function Edit({ mustVerifyEmail, status, foto_url }) {
    const [toast, setToast] = useState({ show: false, message: '' });
    const [isLoading, setIsLoading] = useState(false);
    
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    
    const prevFotoUrl = useRef(foto_url);

    useEffect(() => {
        const removeStartListener = router.on('start', (event) => {
            if (['patch', 'post', 'put'].includes(event.detail.visit.method)) {
                setIsLoading(true);
            }
        });
        const removeFinishListener = router.on('finish', () => setIsLoading(false));
        return () => {
            removeStartListener();
            removeFinishListener();
        };
    }, []);

    useEffect(() => {
        if (status === 'profile-updated') {
            let pesan = 'Informasi profil berhasil tersimpan';
            if (prevFotoUrl.current && !foto_url) {
                pesan = 'Foto profil berhasil dihapus';
            }
            setToast({ show: true, message: pesan });
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, show: false }));
            }, 1500);
            prevFotoUrl.current = foto_url;
            return () => clearTimeout(timer);
        }
    }, [status, foto_url]); 

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-5">
                    <Link
                        href={route('profile.show')}
                        className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                    >
                        <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </Link>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold tracking-tight text-gray-900">
                            Pengaturan Akun
                        </h2>
                        <p className="text-sm font-medium text-gray-500">
                            Kelola informasi profil dan keamanan Anda
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Edit Profil" />

            {isLoading && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] transition-all duration-300">
                    <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/95 px-8 py-6 shadow-xl ring-1 ring-slate-900/5 backdrop-blur-sm">
                        <svg className="h-7 w-7 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm font-semibold tracking-wide text-slate-700">Menyimpan...</p>
                    </div>
                </div>
            )}

            <div className="fixed top-8 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4">
                <Transition show={toast.show} enter="transform transition ease-out duration-300" enterFrom="-translate-y-10 opacity-0" enterTo="translate-y-0 opacity-100" leave="transform transition ease-in duration-300" leaveFrom="translate-y-0 opacity-100" leaveTo="-translate-y-10 opacity-0">
                    <div className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-slate-900 px-5 py-2.5 shadow-lg shadow-slate-900/20">
                        <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                        <p className="text-xs font-semibold tracking-wide text-white">{toast.message}</p>
                    </div>
                </Transition>
            </div>
            
            <div className="py-10 relative">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-6">

                        <div className="overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sm:rounded-3xl">
                            <div className="p-6 sm:p-10">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    foto_url={foto_url}
                                />
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sm:rounded-3xl">
                            
                            <button
                                onClick={() => setIsPasswordOpen(!isPasswordOpen)}
                                className="flex w-full items-center justify-between p-6 sm:px-10 sm:py-8 text-left transition-colors hover:bg-slate-50 focus:outline-none"
                            >
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Update Password</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Perbarui kata sandi untuk menjaga keamanan akun Anda.
                                    </p>
                                </div>
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-transform duration-300 ${isPasswordOpen ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-gray-400'}`}>
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>
                            </button>

                            <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isPasswordOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                <div className="overflow-hidden">
                                    <div className="border-t border-slate-100 p-6 sm:p-10 pt-0 sm:pt-6">
                                      
                                        <UpdatePasswordForm />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}