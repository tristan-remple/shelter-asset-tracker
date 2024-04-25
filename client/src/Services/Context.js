import { createContext } from 'react'

//------ MODULE INFO
// This module defines and initializes the context variables that should be widely available in the app
// Imported by: App

// authContext = [ isAdmin, setIsAdmin ] : bool
export const authContext = createContext([])

// statusContext = [ status, setStatus ] : string, notifies the user of actions
export const statusContext = createContext([])

// userContext = object with user info, set at login
// determines what the user can or cannot view and do
export const userContext = createContext({
    userId: 0,
    locationAuth: [],
    admin: false
})