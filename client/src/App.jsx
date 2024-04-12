// external imports
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

// internal imports
import './css/style.css'
import { authContext, statusContext } from './Services/Context'
import authService from './Services/authService'
import { GeneralRoutes, AdminRoutes } from './Services/ProtectedRoutes'

// component imports
import Header from './Reusables/Header'
import Footer from './Reusables/Footer'
import ItemDetails from './Items/ItemDetails'
import ItemEdit from './Items/ItemEdit'
import ItemCreate from './Items/ItemCreate'
import UnitDetails from './Units/UnitDetails'
import LocationDetails from './Locations/LocationDetails'
import LocationList from './Locations/LocationList'
import UnitDelete from './Units/UnitDelete'
import LocationEdit from './Locations/LocationEdit'
import LocationCreate from './Locations/LocationCreate'
import LocationDelete from './Locations/LocationDelete'
import UnitEdit from './Units/UnitEdit'
import UnitCreate from './Units/UnitCreate'
import CategoryList from './Categories/CategoryList'
import CategoryDetails from './Categories/CategoryDetails'
import CategoryEdit from './Categories/CategoryEdit'
import Dashboard from './Admin/Dashboard'
import CategoryDelete from './Categories/CategoryDelete'
import LogIn from './Auth/LogIn'
import LogOut from './Auth/LogOut'
import UserList from './Users/UserList'
import UserDetails from './Users/UserDetails'
import UserCreate from './Users/UserCreate'
import UserEdit from './Users/UserEdit'
import UserDelete from './Users/UserDelete'
import ResetPassword from './Auth/ResetPassword'
import Error from './Reusables/Error'
import CategoryCreate from './Categories/CategoryCreate'
import FAQ from './Reusables/FAQ'
import Register from './Users/Register'

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

  // Sets a status message to update the user on site actions.
  // Some status messages persist for longer than they need to.
  const [ status, setStatus ] = useState("")

  return (
    <>
      <authContext.Provider value={ { isAdmin, setIsAdmin } }>
      <statusContext.Provider value={ { status, setStatus } }>
        <Header />
        <Routes>
          <Route path="/" element={ <LogIn /> } />
          <Route path="/logout" element={ <LogOut /> } />
          <Route path="/reset/:hash" element={ <ResetPassword /> } />
          <Route element={<GeneralRoutes />}>
            <Route path="/item/:id" element={ <ItemDetails /> } />
            <Route path="/item/:id/edit" element={ <ItemEdit /> } />
            <Route path="/unit/:id/add" element={ <ItemCreate /> } />
            <Route path="/unit/:id" element={ <UnitDetails /> } />
            <Route path="/location/:id" element={ <LocationDetails /> } />
            <Route path="/location" element={ <LocationDetails /> } />
            <Route path="/locations" element={ <LocationList /> } />
            <Route path="/user" element={ <UserDetails /> } />
            <Route path="/user/:id/edit" element={ <UserEdit /> } />
            <Route path="/faq" element={ <FAQ /> } />
            <Route path="/register" element={ <Register /> } />
          </Route>
          <Route element={<AdminRoutes />}>
            <Route path="/unit/:id/edit" element={ <UnitEdit /> } />
            <Route path="/unit/:id/delete" element={ <UnitDelete /> } />
            <Route path="/location/:id/add" element={ <UnitCreate /> } />
            <Route path="/location/:id/edit" element={ <LocationEdit /> } />
            <Route path="location/:id/delete" element={ <LocationDelete /> } />
            <Route path="/locations/add" element={ <LocationCreate /> } />
            <Route path="/categories" element={ <CategoryList /> } />
            <Route path="/categories/add" element={ <CategoryCreate /> } />
            <Route path="/category/:id" element={ <CategoryDetails /> } />
            <Route path="/category/:id/edit" element={ <CategoryEdit /> } />
            <Route path="/category/:id/delete" element={ <CategoryDelete /> } />
            <Route path="/admin" element={ <Dashboard /> } />
            <Route path="/users" element={ <UserList /> } />
            <Route path="/user/:id" element={ <UserDetails /> } />
            <Route path="/users/add" element={ <UserCreate /> } />
            <Route path="/users/:id/delete" element={ <UserDelete /> } />
          </Route>
          <Route path="/*" element={ <Error err="unknown" /> } />
        </Routes>
        <Footer />
      </statusContext.Provider>
      </authContext.Provider>
    </>
  )
}

export default App