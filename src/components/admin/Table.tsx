interface TableProps<T> {
  data: T[];
  columns: { header: string; accessor: (item: T) => React.ReactNode }[];
  actions?: (item: T) => React.ReactNode; // <-- Add this line
}

const Table = <T,>({ data, columns, actions }: TableProps<T>) => {
  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} className="py-2 px-4 border-b">{col.header}</th>
          ))}
          {actions && <th className="py-2 px-4 border-b">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr key={rowIndex} className="border-b">
            {columns.map((col, colIndex) => (
              <td key={colIndex} className="py-2 px-4">{col.accessor(item)}</td>
            ))}
            {actions && <td className="py-2 px-4">{actions(item)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
