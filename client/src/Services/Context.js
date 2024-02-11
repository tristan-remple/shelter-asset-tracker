import { createContext } from 'react'

//------ MODULE INFO
// This module defines and initializes the context variables that should be widely available in the app
// Imported by: App.jsx

// authContext = [ isAdmin, setIsAdmin ] : bool
export const authContext = createContext([])

// statusContext = [ status, setStatus ] : string, notifies the user of actions
export const statusContext = createContext([])