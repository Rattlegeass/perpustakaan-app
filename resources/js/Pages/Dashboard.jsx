import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard(props) {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );
    
    const chartData = {
        labels: props.monthlyFines.map(
            item => `Bulan ${item.month}`
        ),
        datasets: [
            {
                label: 'Total Denda',
                data: props.monthlyFines.map(
                    item => item.total
                ),
            },
        ],
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">
                    Dashboard
                </h1>

                <div className="grid grid-cols-3 gap-4">
                <div className="border p-4">
                    <h2>Total Buku</h2>
                    <p className="text-2xl">
                        {props.totalBooks}
                    </p>
                </div>
                <div className="border p-4">
                    <h2>Total Peminjaman</h2>
                    <p className="text-2xl">
                        {props.totalBorrowings}
                    </p>
                </div>
                <div className="border p-4">
                    <h2>Total Denda</h2>
                    <p className="text-2xl">
                        Rp {props.totalFine}
                    </p>
                </div>
                <div className="border p-4">
                    <h2>Rata-rata Denda</h2>
                    <p className="text-2xl">
                        Rp {props.averageFine}
                    </p>
                </div>
                <div className="border p-4">
                    <h2>Denda Tertinggi</h2>
                    <p className="text-2xl">
                        Rp {props.maxFine}
                    </p>
                </div>
                <div className="border p-4">
                    <h2>Denda Terendah</h2>
                    <p className="text-2xl">
                        Rp {props.minFine}
                    </p>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">
                    Rekap Denda Bulanan
                </h2>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">
                                Bulan
                            </th>
                            <th className="border p-2">
                                Total Denda
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.monthlyFines.map((item) => (
                            <tr key={item.month}>
                                <td className="border p-2">
                                    {item.month}
                                </td>
                                <td className="border p-2">
                                    Rp {item.total}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">
                    Grafik Denda Bulanan
                </h2>
                <Bar data={chartData} />
            </div>
            </div>
        </AuthenticatedLayout>
    );
}