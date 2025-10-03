function GenericTable({
  columns,
  data,
  renderActions,
  loading,
  noDataComponent,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="dark:bg-gray-900 bg-white">
            {columns.map((col, index) => (
              <th
                key={index}
                className="p-2 dark:text-gray-100 text-left font-medium"
              >
                {col.title}
              </th>
            ))}
            {renderActions && (
              <th className="p-2 dark:text-gray-100 text-right font-medium">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {!loading && data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr
                key={item.id || rowIndex}
                className="dark:hover:bg-gray-900 hover:bg-gray-50"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="p-2 border text-xs dark:border-gray-700 dark:text-gray-100 border-gray-300"
                  >
                    {typeof col.render === "function"
                      ? col.render(item)
                      : item[col.key]}
                  </td>
                ))}
                {renderActions && (
                  <td className="p-2 border text-right dark:border-gray-700 border-gray-300">
                    {renderActions(item)}
                  </td>
                )}
              </tr>
            ))
          ) : !loading && data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0)}
                className="text-center py-4 text-gray-500 dark:text-gray-400"
              >
                {noDataComponent}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export default GenericTable;
