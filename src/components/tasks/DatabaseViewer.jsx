import React from 'react'

export default function DatabaseViewer({ structure }) {
  if (!structure) return null

  return (
    <div>
      {Object.entries(structure).map(([tableName, tableData]) => (
        <div key={tableName}>
          <h3>{tableName}</h3>
          
          <table>
            <thead>
              <tr>
                <th>Column</th>
                <th>Type</th>
                <th>Constraints</th>
              </tr>
            </thead>
            <tbody>
              {tableData.columns.map((column) => (
                <tr key={column.name}>
                  <td>{column.name}</td>
                  <td>{column.type}</td>
                  <td>
                    {column.pk && <span>PK</span>}
                    {column.notnull === 1 && <span>NOT NULL</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tableData.sample_data && tableData.sample_data.length > 0 && (
            <div>
              <h4>Sample Data</h4>
              <table>
                <thead>
                  <tr>
                    {tableData.columns.map((column) => (
                      <th key={column.name}>{column.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.sample_data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>
                          {cell?.toString() ?? 'NULL'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}