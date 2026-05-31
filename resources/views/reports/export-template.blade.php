<!DOCTYPE html>
<html>
<head>
    <title>{{ $title }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h2 { margin: 0; padding: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
    </style>
</head>
<body>

    <div class="header">
        <h2>{{ $title }}</h2>
        <p>Dicetak pada: {{ \Carbon\Carbon::now()->format('d M Y H:i') }}</p>
    </div>

    <table>
        {{-- HEADER TABEL SESUAI TIPE DATA --}}
        <thead>
            <tr>
                <th>No</th>
                
                @if(in_array($type, ['semua', 'peminjaman', 'aktif', 'populer', 'statistik']))
                    <th>Nama Peminjam</th>
                    <th>Tgl Pinjam</th>
                    <th>Status</th>
                    <th>Total Denda</th>
                
                @elseif($type == 'denda')
                    <th>Peminjam</th>
                    <th>Jumlah Denda</th>
                    <th>Status Pembayaran</th>
                
                @elseif($type == 'anggota')
                    <th>Nama Anggota</th>
                    <th>Email</th>
                    <th>Bergabung Sejak</th>
                
                @elseif($type == 'buku')
                    <th>Judul Buku</th>
                    <th>Penulis</th>
                    <th>Penerbit</th>
                    <th>Stok Tersedia</th>
                @endif
            </tr>
        </thead>

        {{-- ISI TABEL SESUAI TIPE DATA --}}
        <tbody>
            @forelse($data as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    
                    @if(in_array($type, ['semua', 'peminjaman', 'aktif', 'populer', 'statistik']))
                        <td>{{ $item->user->name ?? 'N/A' }}</td>
                        <td>{{ $item->tgl_peminjaman ? \Carbon\Carbon::parse($item->tgl_peminjaman)->format('d-m-Y') : '-' }}</td>
                        <td>{{ strtoupper(str_replace('_', ' ', $item->status_peminjaman)) }}</td>
                        <td>
                            @php
                                $denda = 0;
                                $details = is_iterable($item->detailPeminjaman) ? $item->detailPeminjaman : [$item->detailPeminjaman];
                                foreach($details as $det) {
                                    if($det && $det->denda) $denda += $det->denda->jumlah_denda;
                                }
                            @endphp
                            Rp {{ number_format($denda, 0, ',', '.') }}
                        </td>
                    
                    @elseif($type == 'denda')
                        <td>{{ $item->detailPeminjaman->peminjaman->user->name ?? 'N/A' }}</td>
                        <td>Rp {{ number_format($item->jumlah_denda, 0, ',', '.') }}</td>
                        <td>{{ strtoupper($item->status_pembayaran ?? 'BELUM DIBAYAR') }}</td>
                    
                    @elseif($type == 'anggota')
                        <td>{{ $item->name }}</td>
                        <td>{{ $item->email }}</td>
                        <td>{{ $item->created_at->format('d-m-Y') }}</td>
                    
                    @elseif($type == 'buku')
                        <td>{{ $item->judul }}</td>
                        <td>{{ $item->penulis }}</td>
                        <td>{{ $item->penerbit }}</td>
                        <td>{{ $item->stok }}</td>
                    @endif
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align: center;">Tidak ada data ditemukan pada rentang waktu ini.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

</body>
</html>