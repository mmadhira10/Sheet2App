import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// import { useHistory } from 'react-router-dom'
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/auth',
    withCredentials: true
})

const AuthContext = createContext();

function AuthContextProvider(props) {
    const navigate = useNavigate();

    const [auth, setAuth] = useState({
        email: null,
        name: null,
        loggedIn: false
    });
    // const history = useHistory();

    useEffect(() => {
        auth.loginUser();
    }, [])

    auth.loginUser = async function () {
        try {
            const response = await api.get('/login/success/');
            // console.log(response);
            // console.log(response.data);
            setAuth({
                email: response.data.user.emails[0].value,
                name: response.data.user.displayName,
                loggedIn: true
            });
            // console.log(auth.email);
        }
        catch (error) {
            console.log(error);
        }
    }

    auth.logoutUser = async function () {
        try {
            const response = await api.get('/logout/');
            setAuth({
                email: null,
                name: null,
                loggedIn: false
            });
            navigate("/");
        }
        catch(err) {
            console.log(err);
        }
    }

    return (
        <AuthContext.Provider value={{auth}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
export { AuthContextProvider }