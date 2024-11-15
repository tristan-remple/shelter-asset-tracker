// external imports
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

// internal imports
import './css/style.css'
import { userContext, statusContext } from './Services/Context'
import { GeneralRoutes, AdminRoutes } from './Services/ProtectedRoutes'

// component imports
import Header from './Components/Header'
import Footer from './Components/Footer'

import LogIn from './Auth/LogIn'
import LogOut from './Auth/LogOut'
import ForgotPassword from './Auth/ForgotPassword'
import FAQ from './Components/FAQ'
import Dashboard from './Admin/Dashboard'
import Settings from './Admin/Settings'

import ItemDetails from './Items/ItemDetails'
import ItemEdit from './Items/ItemEdit'
import ItemInspect from './Items/ItemInspect'
import ItemCreate from './Items/ItemCreate'
import ItemRecovery from './Items/ItemRecovery'

import UnitDetails from './Units/UnitDetails'
import UnitEdit from './Units/UnitEdit'
import UnitCreate from './Units/UnitCreate'
import UnitDelete from './Units/UnitDelete'
import UnitRecovery from './Units/UnitRecovery'

import LocationList from './Locations/LocationList'
import LocationDetails from './Locations/LocationDetails'
import LocationEdit from './Locations/LocationEdit'
import LocationCreate from './Locations/LocationCreate'
import LocationDelete from './Locations/LocationDelete'
import LocationRecovery from './Locations/LocationRecovery'

import CategoryList from './Categories/CategoryList'
import CategoryDetails from './Categories/CategoryDetails'
import CategoryEdit from './Categories/CategoryEdit'
import CategoryCreate from './Categories/CategoryCreate'
import CategoryDelete from './Categories/CategoryDelete'
import CategoryRecovery from './Categories/CategoryRecovery'

import UserList from './Users/UserList'
import UserDetails from './Users/UserDetails'
import UserCreate from './Users/UserCreate'
import UserEdit from './Users/UserEdit'
import UserDelete from './Users/UserDelete'
import ResetPassword from './Auth/ResetPassword'

import Error from './Components/Error'

//------ MODULE INFO
// This is the first module accessed by main.jsx, which is connected to index.html as the entry point of our app.
// The page template is set in this file.
// The routing and context is also here.
// Imported by: main

function App() {

  // User details state, to be set to context.
  // Updated by LogIn and LogOut.
  // Read by ProtectedRoutes and Header at a minimum.
  const [ userDetails, setUserDetails ] = useState({
    userId: null,
    isAdmin: false,
    facilityAuths: []
  })

  // Sets a status message to update the user on site actions.
  // Updated by any component that needs to communicate without throwing a whole error screen.
  // Read by Statusbar.
  const [ status, setStatus ] = useState({
    message: "",
    error: false
  })

  return (
    <>
      <userContext.Provider value={{ userDetails, setUserDetails }}>
      <statusContext.Provider value={{ status, setStatus }}>
        <Header />
        <Routes>
          <Route path="/" element={ <LogIn /> } />
          <Route path="/logout" element={ <LogOut /> } />
          <Route path="/reset" element={ <ForgotPassword /> } />
          <Route path="/reset/:hash" element={ <ResetPassword /> } />
          <Route element={<GeneralRoutes />}>
            <Route path="/item/:id" element={ <ItemDetails /> } />
            <Route path="/item/:id/inspect" element={ <ItemInspect /> } />
            <Route path="/item/:id/edit" element={ <ItemEdit /> } />
            <Route path="/unit/:id/add" element={ <ItemCreate /> } />
            <Route path="/unit/:id" element={ <UnitDetails /> } />
            <Route path="/location/:id" element={ <LocationDetails /> } />
            <Route path="/location" element={ <LocationDetails /> } />
            <Route path="/locations" element={ <LocationList /> } />
            <Route path="/user" element={ <UserDetails /> } />
            <Route path="/user/:id/edit" element={ <UserEdit /> } />
            <Route path="/faq" element={ <FAQ /> } />
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
            <Route path="/admin/settings" element={ <Settings /> } />
            <Route path="/users" element={ <UserList /> } />
            <Route path="/user/:id" element={ <UserDetails /> } />
            <Route path="/users/add" element={ <UserCreate /> } />
            <Route path="/users/:id/delete" element={ <UserDelete /> } />
            <Route path="/restore/items" element={ <ItemRecovery /> } />
            <Route path="/restore/units" element={ <UnitRecovery /> } />
            <Route path="/restore/locations" element={ <LocationRecovery /> } />
            <Route path="/restore/categories" element={ <CategoryRecovery /> } />
          </Route>
          <Route path="/*" element={ <Error err="unknown" /> } />
        </Routes>
        <Footer />
      </statusContext.Provider>
      </userContext.Provider>
    </>
  )
}

export default App