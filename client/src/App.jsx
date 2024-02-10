// external imports
import { useEffect, useState } from 'react'
import { Routes } from 'react-router-dom'

// internal imports
import './css/style.css'
import { authContext } from './Services/Context'
import authService from './Services/authService'

// component imports
import Header from './Reusables/Header'
import Footer from './Reusables/Footer'

//------ MODULE INFO
// This is the first module accessed by main.jsx, which is connected to index.html as the entry point of our app.
// The page template is set in this file.
// The routing and context is also here.
// Imported by: main.jsx

function App() {

  // check whether the user is an admin, set it to state
  // this will be used throughout the app, so we will set it to context
  const [ isAdmin, setIsAdmin ] = useState(false)
  useEffect(() => {
    // this function has not been implemented yet
    // you can toggle its return value to check different user views
    const adminCheck = authService.checkAdmin()
    setIsAdmin(adminCheck)
  }, [])

  return (
    <>
      <authContext.Provider value={ { isAdmin, setIsAdmin } }>
        <Header />
        <Routes>

        </Routes>
        <Footer />
      </authContext.Provider>
    </>
  )
}

export default App