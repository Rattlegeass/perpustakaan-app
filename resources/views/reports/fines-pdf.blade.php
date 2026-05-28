<!DOCTYPE html>
<html>
<head>
    <title>Laporan Denda</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #333; padding: 10px; text-align: left; }
        th { background-color: #0B3A60; color: white; }
    </style>
</head>
<body>

    <h1>Laporan Denda Perpustakaan</h1>
    <p>Tanggal: {{ date('d-m-Y H:i') }}</p>

    <table>
        <tr>
            <th>No</th>
            <th>Nama Peminjam</th>
            <th>Email</th>
            <th>Judul Buku</th>
            <th>Status Pembayaran</th>
            <th>Jumlah Denda</th>
        </tr>

        @forelse($dendas as $index => $denda)

        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $denda->detailPeminjaman->peminjaman->user->name }}</td>
            <td>{{ $denda->detailPeminjaman->peminjaman->user->email }}</td>
            <td>{{ $denda->detailPeminjaman->buku->judul }}</td>
            <td>{{ ucfirst(str_replace('_', ' ', $denda->status_pembayaran)) }}</td>
            <td>Rp {{ number_format($denda->jumlah_denda, 0, ',', '.') }}</td>
        </tr>

        @empty

        <tr>
            <td colspan="6" style="text-align: center;">Tidak ada data denda</td>
        </tr>

        @endforelse

    </table>

</body>
</html>