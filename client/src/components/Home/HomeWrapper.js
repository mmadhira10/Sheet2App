import { useContext } from 'react'
import AppsPage from './AppsPage'
import Login from './Login'
import AuthContext from '../../auth'

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);

    // console.log(auth.loggedIn);
    if (auth.loggedIn) {
        return <AppsPage />
    }
    else{
        return <Login />
    }
}