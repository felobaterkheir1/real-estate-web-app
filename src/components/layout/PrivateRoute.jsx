import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus'

const PrivateRoute = () => {
    const { loggedIn, changeStatus } = useAuthStatus();
    if (changeStatus){
        return <h1>Loading...</h1>
    }
    return loggedIn ? <Outlet /> : <Navigate to='/signin'/>
}

export default PrivateRoute
