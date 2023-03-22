import React from 'react'
import Button, { ButtonProps } from '@mui/material/Button'
import { purple } from '@mui/material/colors'
import { styled } from '@mui/material/styles'
import './Header.css'

const Header = (props) => {
  return (
    <div className='header'>
      <h1>Sheet2App Home Page/Welcome back, John Doe!</h1>
      <div className='header-right'>
        <Button variant='contained'>Login/Logout</Button>
      </div>
    </div>
  )
}

export default Header