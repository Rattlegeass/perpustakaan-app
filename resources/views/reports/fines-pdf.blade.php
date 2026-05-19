<!DOCTYPE html>
<html>
<head>
    <title>Laporan Denda</title>
</head>
<body>

    <h1>Laporan Denda</h1>

    <table border="1" width="100%" cellpadding="5">

        <tr>
            <th>Peminjam</th>
            <th>Hari Telat</th>
            <th>Total Denda</th>
        </tr>

        @foreach($fines as $fine)

        <tr>
            <td>
                {{ $fine->borrowing->borrower->name }}
            </td>

            <td>
                {{ $fine->late_days }}
            </td>

            <td>
                Rp {{ $fine->total_fine }}
            </td>
        </tr>

        @endforeach

    </table>

</body>
</html>