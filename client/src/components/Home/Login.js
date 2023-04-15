import React from 'react'
import Button, { ButtonProps } from '@mui/material/Button';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

import AuthContext from '../../auth';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import './Login.css'

const Login = (props) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

	const googleAuth = () => {
		window.open(
			`http://localhost:4000/auth/google/callback`,
			"_self"
		);
	};

  return (
    <div className='header' style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",}}>
      <div>
        <Typography variant="h4">Sheet2App Log In</Typography>
      </div>
      <div>
        <Button variant='contained' onClick={googleAuth}>Login with Google</Button>
      </div>
    </div>
  )
}

export default Login