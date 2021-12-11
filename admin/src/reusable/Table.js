/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { MDBDataTableV5 } from 'mdbreact'
import React from 'react'

const Table = ({ columns, rows, scrollY, nohover, noSearch }) => {
  return (
    <MDBDataTableV5
      searchTop = {noSearch ? false : true}
      searchBottom={false}
      scrollX
      scrollY={scrollY ? true : false}
      hover = {nohover ? false : true}
      entriesOptions={[5, 20, 25]}
      entries={5}
      pagesAmount={4}
      data={{
        columns: columns,
        rows: rows,
      }}
    />
  )
}

export default Table
