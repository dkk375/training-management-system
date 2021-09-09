import React from 'react'
import { useTable } from 'react-table'

export default function Table({columns, data}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
      } = useTable({columns: React.useMemo(() => columns, []), data})
    return (
        <table {...getTableProps()}>
        <thead>
        {headerGroups.map(hGroup => {
            const { key, ...restHeaderGroupProps } = hGroup.getHeaderGroupProps()
            return (
                <tr key={key} {...restHeaderGroupProps}>
                {hGroup.headers.map(column => {
                    const { key, ...restCol } = column.getHeaderProps()
                    return (
                        <th key={key} {...restCol}>
                            {column.render('Header')}
                        </th>
                    )
                })}
                </tr>
            )
        })}
        </thead>
        <tbody {...getTableBodyProps()}>
        {rows.map(row => {
            prepareRow(row)
            const { key, ...restRowProps } = row.getRowProps()
            return (
                <tr key={key} {...restRowProps}>
                {row.cells.map(cell => {
                    const { key, ...restCellProps } = cell.getCellProps()
                    return (
                        <td key={key} {...restCellProps}>
                            {cell.render('Cell')}
                        </td>
                    )
                })}
                </tr>
            )
        })}
        </tbody>
      </table>
    )
}