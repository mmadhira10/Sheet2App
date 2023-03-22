import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import TableView from './TableView'
import Button from '@mui/material/Button'

function createData(
  name: String,
  owner: String,
  visibility: String,
  view_type: String,
  roles: String,
  allowed_actions: String
) {
  return { name, owner, visibility, view_type, roles, allowed_actions }
}

const rows = [
  createData('Test', 'John Doe', 'Public', 'Table', 'Admin', 'Delete'),
  createData(
    'Test1',
    'Frank Doe',
    'Public',
    'Table',
    'Admin',
    'Add, Edit, Delete'
  ),
  createData('Test2', 'Larry Doe', 'Private', 'Detailed', 'Admin', 'Add, Edit'),
  createData('Test3', 'Ben Doe', 'Private', 'Table', 'Admin', 'Add, Delete'),
  createData(
    'Test4',
    'Bob Doe',
    'Public',
    'Detailed',
    'Admin',
    'Add, Edit, Delete'
  ),
]

const data = [rows]

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <h3>Your views</h3>
      {data.map((view, i) => (
        <TableView view={view} key={i} />
      ))}
      <Button variant='contained'>Create New View</Button>
    </div>
  )
}

export default Dashboard