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
        
        .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 12px;
            border-bottom: 1px dotted #ccc;
            padding-bottom: 5px;
        }
        
        .label {
            font-weight: bold;
            width: 45%;
            color: #333;
        }
        
        .value {
            width: 50%;
            text-align: right;
            color: #000;
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
            <div class="section-title">📋 DATA PEMINJAM</div>
            <div class="row">
                <span class="label">Nama:</span>
                <span class="value">{{ $peminjaman->user->name }}</span>
            </div>
            <div class="row">
                <span class="label">Email:</span>
                <span class="value">{{ $peminjaman->user->email }}</span>
            </div>
            <div class="row">
                <span class="label">No. Telepon:</span>
                <span class="value">{{ $peminjaman->user->no_telp ?? '-' }}</span>
            </div>
            <div class="row">
                <span class="label">No. Identitas:</span>
                <span class="value">{{ $peminjaman->user->no_identitas ?? '-' }}</span>
            </div>
        </div>

        <div class="separator"></div>

        <!-- Bagian 2: Data Peminjaman -->
        <div class="section">
            <div class="section-title">📅 DATA PEMINJAMAN</div>
            <div class="row">
                <span class="label">Tanggal Peminjaman:</span>
                <span class="value">{{ $peminjaman->tgl_peminjaman }}</span>
            </div>
            <div class="row">
                <span class="label">Batas Pengembalian:</span>
                <span class="value">{{ $peminjaman->batas_tgl_peminjaman }}</span>
            </div>
            <div class="row">
                <span class="label">Status:</span>
                <span class="value">
                    @if($peminjaman->status_peminjaman === 'dipinjam')
                        <strong style="color: #ff6b6b;">SEDANG DIPINJAM</strong>
                    @elseif($peminjaman->status_peminjaman === 'selesai')
                        <strong style="color: #51cf66;">SELESAI</strong>
                    @else
                        {{ ucfirst($peminjaman->status_peminjaman) }}
                    @endif
                </span>
            </div>
            <div class="row">
                <span class="label">Total Item:</span>
                <span class="value">{{ $peminjaman->detailPeminjaman->count() }} Buku</span>
            </div>
        </div>

        <div class="separator"></div>

        <!-- Bagian 3: Daftar Buku yang Dipinjam -->
        <div class="section">
            <div class="section-title">📚 BUKU YANG DIPINJAM</div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 8%;">No</th>
                        <th style="width: 35%;">Judul Buku</th>
                        <th style="width: 30%;">Penulis</th>
                        <th style="width: 27%;">Status</th>
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
        @if($peminjaman->status_peminjaman === 'dipinjam')
            <div class="warning">
                ⚠️ <strong>Penting:</strong> Pastikan untuk mengembalikan semua buku sebelum tanggal batas pengembalian. Keterlambatan akan dikenakan denda.
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
