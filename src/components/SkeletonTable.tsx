export const SkeletonTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-36"></div></td>
              <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24 ml-auto"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
