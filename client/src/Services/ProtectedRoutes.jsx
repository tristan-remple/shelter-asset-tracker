// external dependencies
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

// internal dependencies
import { userContext } from './Context'

//------ MODULE INFO
// These functions check whether a user should be allowed to access a page before they reach it.
// Users will be redirected to the home page, which is a log in screen for logged out users.
// The home page redirects to the user's assigned location page if they are already logged in.
// Imported by: App

// Routes for general users pass through this function.
export const GeneralRoutes = () => {
    const { userDetails } = useContext(userContext)
    return userDetails.userId ? <Outlet /> : <Navigate to='/' />
}

// Routes for admin users pass through this function.
export const AdminRoutes = () => {
    const { userDetails } = useContext(userContext)
    return userDetails.isAdmin ? <Outlet /> : <Navigate to='/' />
}