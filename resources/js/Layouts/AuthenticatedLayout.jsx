import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const flash = usePage().props.flash || {};
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const notifications = usePage().props.auth.notifications || [];
    const [showNotifications, setShowNotifications] = useState(false);
    const [toast, setToast] = useState(null);

    // Menu items berdasarkan role
    const getMenuItems = () => {
        const baseMenus = [
            {
                title: 'Dashboard',
                icon: '📊',
                href: route('dashboard'),
                active: route().current('dashboard'),
            },
        ];

        if (user.role === 'admin' || user.role === 'petugas') {
            const adminMenus = [
                ...baseMenus,
                {
                    title: 'Manajemen Peminjaman',
                    icon: '📋',
                    href: route('peminjamans.index'),
                    active: route().current('peminjamans.*'),
                },
                {
                    title: 'Manajemen Denda',
                    icon: '💰',
                    href: route('dendas.index'),
                    active: route().current('dendas.index'),
                },
                {
                    title: 'Report',
                    icon: '📈',
                    href: route('reports.index'),
                    active: route().current('reports.index'),
                },
                {
                    title: 'Manajemen Buku',
                    icon: '📚',
                    href: route('bukus.index'),
                    active: route().current('bukus.*'),
                },
            ];

            if (user.role === 'admin') {
                adminMenus.push(
                    {
                        title: 'Manajemen Member',
                        icon: '👥',
                        href: route('members.index'),
                        active: route().current('members.*'),
                    }
                );
            }

            return adminMenus;
        } else {
            return [
                ...baseMenus,
                {
                    title: 'Daftar Buku',
                    icon: '📖',
                    href: route('bukus.member'),
                    active: route().current('bukus.member'),
                },
                {
                    title: 'Peminjaman Saya',
                    icon: '🔖',
                    href: route('peminjamans.member'),
                    active: route().current('peminjamans.member'),
                },
                {
                    title: 'Denda Saya',
                    icon: '💰',
                    href: route('dendas.member'),
                    active: route().current('dendas.member'),
                },
            ];
        }
    };

    const menuItems = getMenuItems();

    // Handle flash notifications
    useEffect(() => {
        if (flash.notification) {
            setToast(flash.notification);
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash.notification]);

    return (
        <div className="min-h-screen bg-[#F4F7FA]">
            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="w-9 h-9 bg-[#0B3A60] rounded-lg flex items-center justify-center text-yellow-400 group-hover:bg-blue-600 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z" />
                            </svg>
                        </div>
                        <span className="text-lg font-black text-[#0B3A60] tracking-tight hidden sm:block">Pustaka<span className="text-blue-600">DIGITAL</span></span>
                    </Link>

                    {/* Right Side - Notifications & Profile */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <span className="text-xl">🔔</span>
                                {notifications.length > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                                    <div className="p-4 border-b border-slate-100 bg-[#0B3A60] text-white">
                                        <h3 className="font-bold">Notifikasi ({notifications.length})</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif, idx) => (
                                                <div key={idx} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                    <p className="text-sm font-semibold text-slate-700">{notif.title}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                                                    <p className="text-xs text-slate-400 mt-2">{notif.time}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-slate-400">
                                                <p className="text-sm">Tidak ada notifikasi baru</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                        <div className="hidden sm:block text-right">
                                            <p className="text-sm font-bold text-slate-700">{user.name}</p>
                                            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                        </div>

                                        {/* 👇 SEKARANG MENGGUNAKAN FOTO JIKA ADA, JIKA TIDAK KEMBALI KE INISIAL */}
                                        <div className="w-10 h-10 rounded-full border-2 border-blue-600/20 bg-[#0B3A60] flex items-center justify-center text-white font-bold text-sm overflow-hidden shadow-sm">
                                            {user.foto ? (
                                                <img
                                                    src={user.foto}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="right" className="mt-2">
                                    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                                        {/* 👇 Foto kecil di dalam menu dropdown */}
                                        <div className="w-8 h-8 rounded-full bg-[#0B3A60] flex items-center justify-center text-white font-bold text-xs overflow-hidden shrink-0">
                                            {user.foto ? (
                                                <img src={user.foto} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-semibold text-slate-700 truncate">{user.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    {user.role !== 'admin' && user.role !== 'petugas' &&
                                        <Dropdown.Link href={route('profile.show')} className="px-4 py-2 text-sm hover:bg-slate-50">
                                            ⚙️ Pengaturan Profile
                                        </Dropdown.Link>
                                    }
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100"
                                    >
                                        🚪 Keluar
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* MAIN CONTAINER */}
            <div className="flex pt-20">
                {/* SIDEBAR - Desktop */}
                <aside className="hidden lg:flex lg:w-64 bg-white border-r border-slate-200 flex-col">
                    <nav className="flex-1 p-6 space-y-2">
                        {menuItems.map((menu) => (
                            <Link
                                key={menu.title}
                                href={menu.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${menu.active
                                    ? 'bg-blue-100 text-[#0B3A60] font-bold shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#0B3A60]'
                                    }`}
                            >
                                <span className="text-xl">{menu.icon}</span>
                                <span className="text-sm font-semibold">{menu.title}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-6 border-t border-slate-200">
                        <p className="text-xs text-slate-500 text-center mb-3">© 2026 PustakaDigital</p>
                        <div className="flex gap-2 justify-center text-xs text-slate-400">
                            <a href="#" className="hover:text-slate-600">Bantuan</a>
                            <span>•</span>
                            <a href="#" className="hover:text-slate-600">Kebijakan</a>
                        </div>
                    </div>
                </aside>

                {/* MOBILE SIDEBAR */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-30 lg:hidden">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>

                        {/* Sidebar Panel */}
                        <div className="absolute left-0 top-20 bottom-0 w-64 bg-white shadow-xl border-r border-slate-200 overflow-y-auto">
                            <nav className="p-6 space-y-2">
                                {menuItems.map((menu) => (
                                    <Link
                                        key={menu.title}
                                        href={menu.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${menu.active
                                            ? 'bg-blue-100 text-[#0B3A60] font-bold'
                                            : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className="text-xl">{menu.icon}</span>
                                        <span className="text-sm font-semibold">{menu.title}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}

                {/* MAIN CONTENT */}
                <main className="flex-1 p-6 md:p-8">
                    {header && (
                        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                            <h1 className="text-3xl font-black text-[#0B3A60]">{header}</h1>
                            <p className="text-slate-500 text-sm mt-2">Kelola dan pantau aktivitas perpustakaan Anda dengan mudah</p>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                        {children}
                    </div>
                </main>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50">
                    <div className={`px-6 py-4 rounded-lg shadow-2xl border-l-4 animate-in fade-in slide-in-from-bottom-4 duration-300 ${toast.type === 'success'
                        ? 'bg-green-50 border-green-500 text-green-800'
                        : toast.type === 'warning'
                            ? 'bg-orange-50 border-orange-500 text-orange-800'
                            : toast.type === 'error'
                                ? 'bg-red-50 border-red-500 text-red-800'
                                : 'bg-blue-50 border-blue-500 text-blue-800'
                        }`}>
                        <p className="font-bold text-sm">{toast.title}</p>
                        <p className="text-xs mt-1 opacity-90">{toast.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}