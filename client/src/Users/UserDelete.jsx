// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import { statusContext } from '../Services/Context'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import authService from '../Services/authService'
import ChangePanel from '../Reusables/ChangePanel'

//------ MODULE INFO
// ** Available for SCSS **
// This module checks that the admin wants to delete a user.
// Imported by: App

const UserDelete = () => {

    const navigate = useNavigate()

    // get context information
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    
    if (!authService.checkAdmin()) {
        console.log("insufficient permission")
        return <Error err="permission" />
    }

    // validate id
    if (id === undefined) {
        console.log("undefined id")
        return <Error err="undefined" />
    }

    // fetch unit data from the api
    const user = apiService.singleUser(id)
    if (!user || user.error) {
        console.log("api error")
        return <Error err="api" />
    }

    // destructure the unit
    const { userId, userName } = user

    // send delete api call
    const confirmDelete = () => {
        if (authService.checkUser() && authService.checkAdmin()) {
            const response = apiService.deleteUnit(user)
            if (response.success) {
                setStatus(`You have successfully deleted user ${ response.userName }.`)
                navigate(`/users`)
            } else {
                setStatus("We weren't able to process your delete user request.")
            }
        } else {
            return <Error err="permission" />
        }
    }

    return (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Deleting { userName }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/user/${ userId }` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className="my-2">{ status }</p></div> }
                <ChangePanel save={ confirmDelete } linkOut={ `/user/${ userId }` } locationId="0" />
            </div>
        </main>
    )
}

export default UserDelete