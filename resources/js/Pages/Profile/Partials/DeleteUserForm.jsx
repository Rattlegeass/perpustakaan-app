import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';

export default function DeleteUserForm() {
    const [stepHapus, setStepHapus] = useState(0); 
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const konfirmasiAwal = () => {
        setStepHapus(1);
    };

    const lanjutKePassword = () => {
        setStepHapus(2);
        setTimeout(() => passwordInput.current?.focus(), 100);
    };

    const closeModal = () => {
        setStepHapus(0);
        clearErrors();
        reset();
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <>
            <button
                onClick={konfirmasiAwal}
                title="Hapus Akun Permanen"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition-all duration-200 hover:scale-[1.03] hover:bg-red-100 hover:text-red-700 active:scale-[0.97]"
            >
                <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>

            {stepHapus > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                    <div 
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
                        onClick={closeModal}
                    ></div>

                    <div className="relative z-10 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all sm:my-8">
                        
                        {stepHapus === 1 && (
                            <div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
                                        </svg>
                                    </div>
                                    <div className="mt-1 w-full">
                                        <h3 className="text-lg font-bold text-gray-900">Konfirmasi Hapus Akun</h3>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Yakin mau hapus akun ini? Semua data kamu akan hilang permanen dan nggak bisa dibalikin lagi, lho.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 active:scale-[0.98] sm:w-auto"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={lanjutKePassword}
                                        className="inline-flex w-full justify-center rounded-xl bg-yellow-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-yellow-600 active:scale-[0.98] sm:w-auto"
                                    >
                                        Ya, Lanjut
                                    </button>
                                </div>
                            </div>
                        )}

                        {stepHapus === 2 && (
                            <form onSubmit={deleteUser}>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                        </svg>
                                    </div>
                                    <div className="mt-1 w-full">
                                        <h3 className="text-lg font-bold text-gray-900">Masukkan Password</h3>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Satu langkah lagi. Silakan masukkan password kamu untuk memastikan ini benar-benar kamu.
                                        </p>
                                        <div className="mt-4">
                                            <input
                                                id="password"
                                                type="password"
                                                name="password"
                                                ref={passwordInput}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                                placeholder="Ketik password di sini..."
                                            />
                                            {errors.password && (
                                                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 active:scale-[0.98] sm:w-auto"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex w-full justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 sm:w-auto"
                                    >
                                        {processing ? 'Menghapus...' : 'Hapus Sekarang'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}