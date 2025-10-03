import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "./ui/alert-dialog";

export default function Table({
    columns,
    columnLabels = {},
    data,
    onDelete,
    onEdit,           // thêm prop edit
    renderCell = {},
    idField = "id"
}) {
    return (
        <table className="w-full border">
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col} className="border p-2">
                            {columnLabels[col] || col}
                        </th>
                    ))}
                    {(onDelete || onEdit) && <th>Hành động</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((row, idx) => (
                    <tr key={idx}>
                        {columns.map((col) => (
                            <td key={col} className="border p-2">
                                {renderCell[col] ? renderCell[col](row[col], row) : row[col]}
                            </td>
                        ))}
                        {(onDelete || onEdit) && (
                            <td className="border p-2 flex gap-2">
                                {onEdit && (
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                        onClick={() => onEdit(row)}
                                    >
                                        Sửa
                                    </button>
                                )}
                                {onDelete && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button className="bg-red-500 text-white px-2 py-1 rounded">
                                                Xóa
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Xóa {row.tenNhomThuoc || "dòng dữ liệu"}?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Sau khi xóa, dữ liệu này sẽ không thể khôi phục lại.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className="flex gap-2">
                                                <AlertDialogCancel>Quay lại</AlertDialogCancel>
                                                <button
                                                    onClick={() => onDelete(row[idField])}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                                >
                                                    Xác nhận
                                                </button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
