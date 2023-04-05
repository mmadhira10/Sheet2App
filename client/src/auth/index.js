import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// import { useHistory } from 'react-router-dom'
import axios from 'axios';

const AuthContext = createContext();

function AuthContextProvider(props) {
    const navigate = useNavigate();

    const [auth, setAuth] = useState({
        email: null,
        loggedIn: false
    });
    // const history = useHistory();

    auth.loginUser = async function () {
        try {
            //    console.log("hi")
            const response = await axios.get("http://localhost:4000/auth/login/success", {withCredentials: true});
            console.log(response.data.user);
            setAuth({
                email: response.data.user.emails[0].value,
                loggedIn: true
            });
            console.log(auth.email);
        }
        catch (error) {
            console.log(error);
        }
    }

    auth.logoutUser = async function () {
        try {
            const response = await axios.get("http://localhost:4000/auth/logout");
            setAuth({
                email: null,
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