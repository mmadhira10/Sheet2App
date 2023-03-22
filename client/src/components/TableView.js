import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

const TableView = (props) => {
  console.log(props)
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align='right'>Owner</TableCell>
              <TableCell align='right'>
                Visibility&nbsp;(public, private)
              </TableCell>
              <TableCell align='right'>
                View Type&nbsp;(table, detail)
              </TableCell>
              <TableCell align='right'>Roles&nbsp;(admin, user)</TableCell>
              <TableCell align='right'>Allowed Actions&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.view.map((info) => (
              <TableRow
                key={info.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  {info.name}
                </TableCell>
                <TableCell align='right'>{info.owner}</TableCell>
                <TableCell align='right'>{info.visibility}</TableCell>
                <TableCell align='right'>{info.view_type}</TableCell>
                <TableCell align='right'>{info.roles}</TableCell>
                <TableCell align='right'>{info.allowed_actions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default TableView