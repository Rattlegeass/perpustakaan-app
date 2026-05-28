<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Struk Peminjaman</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            background: white;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            border: 2px solid #000;
            padding: 20px;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
        }
        
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 2px;
        }
        
        .header p {
            margin: 5px 0 0 0;
            font-size: 12px;
            color: #666;
        }
        
        .struk-number {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            letter-spacing: 1px;
        }
        
        .section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-weight: bold;
            background: #f0f0f0;
            padding: 8px 5px;
            margin-bottom: 10px;
            font-size: 13px;
            border-left: 3px solid #000;
        }
        
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0;
        }
        
        .info-table td {
            padding: 6px 0;
            font-size: 12px;
            border-bottom: 1px dotted #ccc;
            vertical-align: middle;
        }
        
        .info-label {
            font-weight: bold;
            color: #333;
            text-align: left;
            width: 40%;
        }
        
        .info-value {
            color: #000;
            text-align: right;
            width: 60%;
        }
        
        .separator {
            border-top: 1px dashed #000;
            margin: 15px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 11px;
        }
        
        table thead {
            background: #f0f0f0;
        }
        
        table th {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            font-weight: bold;
            font-size: 11px;
        }
        
        table td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }
        
        table tbody tr:nth-child(odd) {
            background: #fafafa;
        }
        
        .total-section {
            background: #f9f9f9;
            padding: 10px;
            border: 1px solid #ddd;
            margin: 15px 0;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 12px;
        }
        
        .total-label {
            font-weight: bold;
        }
        
        .total-value {
            font-weight: bold;
            text-align: right;
        }
        
        .footer {
            text-align: center;
            font-size: 11px;
            margin-top: 20px;
            border-top: 1px solid #000;
            padding-top: 10px;
            color: #666;
        }
        
        .footer-message {
            font-style: italic;
            margin-bottom: 8px;
        }
        
        .footer-timestamp {
            font-size: 10px;
            color: #999;
        }
        
        .warning {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 8px;
            margin: 10px 0;
            font-size: 11px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>PERPUSTAKAAN</h1>
            <p>Sistem Manajemen Perpustakaan Digital</p>
            <p style="margin: 5px 0; font-size: 11px;">{{ $tanggalSekarang }}</p>
        </div>

        <!-- Nomor Struk -->
        <div class="struk-number">
            Nomor Struk: {{ $noStruk }}
        </div>

        <!-- Bagian 1: Data Peminjam -->
        <div class="section">
            <div class="section-title">DATA PEMINJAM</div>
            <table class="info-table">
                <tr>
                    <td class="info-label">Nama:</td>
                    <td class="info-value">{{ $peminjaman->user->name }}</td>
                </tr>
                <tr>
                    <td class="info-label">Email:</td>
                    <td class="info-value">{{ $peminjaman->user->email }}</td>
                </tr>
                <tr>
                    <td class="info-label">No. Telepon:</td>
                    <td class="info-value">{{ $peminjaman->user->no_telp ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="info-label">No. Identitas:</td>
                    <td class="info-value">{{ $peminjaman->user->no_identitas ?? '-' }}</td>
                </tr>
            </table>
        </div>

        <div class="separator"></div>

        <!-- Bagian 2: Data Peminjaman -->
        <div class="section">
            <div class="section-title">DATA PEMINJAMAN</div>
            <table class="info-table">
                <tr>
                    <td class="info-label">Tanggal Peminjaman:</td>
                    <td class="info-value">
                        {{ $peminjaman->tgl_peminjaman ? \Carbon\Carbon::parse($peminjaman->tgl_peminjaman)->format('d-m-Y') : '-' }}
                    </td>
                </tr>
                <tr>
                    <td class="info-label">Batas Pengembalian:</td>
                    <td class="info-value">
                        {{ $peminjaman->batas_tgl_peminjaman ? \Carbon\Carbon::parse($peminjaman->batas_tgl_peminjaman)->format('d-m-Y') : '-' }}
                    </td>
                </tr>
                <tr>
                    <td class="info-label">Status:</td>
                    <td class="info-value">
                        @if($peminjaman->status_peminjaman === 'dipinjam')
                            <strong style="color: #ff6b6b;">SEDANG DIPINJAM</strong>
                        @elseif($peminjaman->status_peminjaman === 'dikembalikan')
                            <strong style="color: #51cf66;">SELESAI / DIKEMBALIKAN</strong>
                        @elseif($peminjaman->status_peminjaman === 'terlambat')
                            <strong style="color: #fa5252;">TERLAMBAT</strong>
                        @elseif($peminjaman->status_peminjaman === 'menunggu_pengambilan')
                            <strong style="color: #ff922b;">MENUNGGU PENGAMBILAN</strong>
                        @elseif($peminjaman->status_peminjaman === 'menunggu_persetujuan')
                            <strong style="color: #4dabf7;">MENUNGGU PERSETUJUAN</strong>
                        @else
                            <strong>{{ strtoupper($peminjaman->status_peminjaman) }}</strong>
                        @endif
                    </td>
                </tr>
                <tr>
                    <td class="info-label">Total Item:</td>
                    <td class="info-value">{{ $peminjaman->detailPeminjaman->count() }} Buku</td>
                </tr>
            </table>
        </div>

        <div class="separator"></div>

        <!-- Bagian 3: Daftar Buku yang Dipinjam -->
        <div class="section">
            <div class="section-title">BUKU YANG DIPINJAM</div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 8%;">No</th>
                        <th style="width: 32%;">Judul Buku</th>
                        <th style="width: 25%;">Penulis</th>
                        <th style="width: 35%;">Status & Info Pengembalian</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($peminjaman->detailPeminjaman as $detail)
                        <tr>
                            <td style="text-align: center;">{{ $loop->iteration }}</td>
                            <td>{{ $detail->buku->judul }}</td>
                            <td>{{ $detail->buku->penulis }}</td>
                            <td>
                                @if($detail->status_buku === 'dipinjam')
                                    <span style="color: #ff6b6b; font-weight: bold;">Dipinjam</span>
                                @elseif($detail->status_buku === 'dikembalikan')
                                    <span style="color: #51cf66; font-weight: bold;">Dikembalikan</span>
                                    @if($detail->tgl_pengembalian)
                                        <div style="font-size: 10px; color: #666; margin-top: 2px;">
                                            Tgl: {{ \Carbon\Carbon::parse($detail->tgl_pengembalian)->format('d-m-Y') }}
                                        </div>
                                    @endif
                                    @if($detail->catatan_kondisi)
                                        <div style="font-size: 10px; color: #666; font-style: italic; margin-top: 1px;">
                                            Kondisi: "{{ $detail->catatan_kondisi }}"
                                        </div>
                                    @endif
                                    @if($detail->dendas && $detail->dendas->count() > 0)
                                        @foreach($detail->dendas as $denda)
                                            <div style="font-size: 10px; color: #fa5252; font-weight: bold; margin-top: 2px;">
                                                Denda: Rp {{ number_format($denda->jumlah_denda, 0, ',', '.') }}
                                                ({{ $denda->status_pembayaran === 'lunas' ? 'Lunas' : 'Belum Bayar' }})
                                            </div>
                                        @endforeach
                                    @endif
                                @elseif($detail->status_buku === 'hilang')
                                    <span style="color: #fa5252; font-weight: bold;">Hilang</span>
                                @elseif($detail->status_buku === 'rusak')
                                    <span style="color: #ff922b; font-weight: bold;">Rusak</span>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" style="text-align: center; padding: 20px;">Tidak ada buku yang dipinjam</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Warning Jika Belum Dikembalikan -->
        @if($peminjaman->status_peminjaman === 'dipinjam' || $peminjaman->status_peminjaman === 'terlambat')
            <div class="warning">
                <strong>Penting:</strong> Pastikan untuk mengembalikan semua buku sebelum tanggal batas pengembalian. Keterlambatan akan dikenakan denda.
            </div>
        @endif

        <!-- Footer -->
        <div class="footer">
            <div class="footer-message">
                Terima kasih telah menggunakan layanan perpustakaan kami.
            </div>
            <div>Harap simpan struk ini sebagai bukti peminjaman.</div>
            <div class="footer-timestamp">
                Dicetak pada: {{ now()->format('d-m-Y H:i:s') }}
            </div>
        </div>
    </div>
</body>
</html>
