// external dependencies
import { createContext } from 'react'

//------ MODULE INFO
// This module defines and initializes the context variables that should be widely available in the app
// Imported by: App

export const authContext = createContext([])

// statusContext = [ status, setStatus ] : string, notifies the user of actions
export const statusContext = createContext({
    status: "",
    setStatus: () => {}
})

// userContext = object with user info, set at login
// determines what the user can or cannot view and do
export const userContext = createContext({
    userDetails: {
        userId: null,
        isAdmin: false,
        facilityAuths: []
    },
    setUserDetails: () => {}
})