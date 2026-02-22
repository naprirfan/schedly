interface DataTableProps<T> {
    data: T[];
    columns: { header: string; accessor: keyof T }[];
    onViewDetail: (id: string) => void;
}

export function DataTable<T extends { id: string | number }>({ data, columns, onViewDetail }: DataTableProps<T>) {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left bg-white">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        {columns.map(col => (
                            <th key={col.header} className="px-6 py-3 text-xs font-bold uppercase text-gray-500 tracking-wider">
                                {col.header}
                            </th>
                        ))}
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                            {columns.map(col => (
                                <td key={col.header} className="px-6 py-4 text-sm text-gray-700">
                                    {String(item[col.accessor])}
                                </td>
                            ))}
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => onViewDetail(String(item.id))}
                                    className="text-blue-600 font-medium hover:underline text-sm"
                                >
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}