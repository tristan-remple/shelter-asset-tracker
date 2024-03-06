// external imports
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

// internal imports
import './css/style.css'
import { authContext, statusContext } from './Services/Context'
import authService from './Services/authService'

// component imports
import Header from './Reusables/Header'
import Footer from './Reusables/Footer'
import Test from './Reusables/Test'
import ItemDetails from './Items/ItemDetails'
import ItemEdit from './Items/ItemEdit'
import ItemCreate from './Items/ItemCreate'
import UnitDetails from './Units/UnitDetails'

//------ MODULE INFO
// This is the first module accessed by main.jsx, which is connected to index.html as the entry point of our app.
// The page template is set in this file.
// The routing and context is also here.
// Imported by: main

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

  // sets a status message to update the user on site actions
  const [ status, setStatus ] = useState("")

  return (
    <>
      <authContext.Provider value={ { isAdmin, setIsAdmin } }>
      <statusContext.Provider value={ { status, setStatus } }>
        <Header />
        <Routes>
          <Route path="/" element={ <Test /> } />
          <Route path="/item" element={ <ItemDetails /> } />
          <Route path="/item/:id" element={ <ItemDetails /> } />
          <Route path="/item/:id/edit" element={ <ItemEdit /> } />
          <Route path="/unit/:id/additem" element={ <ItemCreate /> } />
          <Route path="/unit/:id" element={ <UnitDetails /> } />
        </Routes>
        <Footer />
      </statusContext.Provider>
      </authContext.Provider>
    </>
  )
}

export default App