import React from "react";

interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

const AdminTable = <T extends any>({ data, columns, onEdit, onDelete }: AdminTableProps<T>) => (
  <div className="table-container">
    <table className="admin-table">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col.header}</th>
          ))}
          {(onEdit || onDelete) && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item, idx) => (
            <tr key={(item as any)._id || idx}>
              {columns.map((col, index) => (
                <td key={index}>{col.render(item)}</td>
              ))}
              
              {(onEdit || onDelete) && (
                <td className="actions-cell">
                  {onEdit && (
                    <button 
                      title="Editar" 
                      className="btn-edit" 
                      onClick={() => onEdit(item)}
                    >
                      ✏️
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      title="Eliminar" 
                      className="btn-delete" 
                      onClick={() => onDelete(item)}
                    >
                      🗑️
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '2rem' }}>
              No se encontraron resultados
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default AdminTable;