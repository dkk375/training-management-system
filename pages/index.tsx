import React from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import prisma from '@lib/prisma'
import { DateTime } from 'luxon'
import { useTable } from 'react-table'

export const getServerSideProps:GetServerSideProps = async () => {
  const data = await prisma.event.findMany()
  return {
    props: { 
      data: data.map(item => {
        return {
          id: item.id,
          name: item.name,
          startDate: DateTime.fromJSDate(item.startDate).setLocale('id').toLocaleString(DateTime.DATE_FULL),
          endDate: DateTime.fromJSDate(item.endDate).setLocale('id').toLocaleString(DateTime.DATE_FULL)
        }
      })
    }
  }
}

const Home: NextPage = (props) => {
  const data = props['data']
  const columns = React.useMemo(() => [
    {
      Header: 'ID',
      accessor: 'id'
    },
    {
      Header: 'Agenda',
      accessor: 'name'
    },
    {
      Header: 'Tanggal Mulai',
      accessor: 'startDate'
    },
    {
      Header: 'Tanggal Selesai',
      accessor: 'endDate'
    }
  ], [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({columns, data})

  return (
    <table className="table-auto" {...getTableProps()}>
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
                  <td key={key} {...restRowProps}>
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

export default Home