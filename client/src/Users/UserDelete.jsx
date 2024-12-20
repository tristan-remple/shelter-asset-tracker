// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import { statusContext } from '../Services/Context'

// components
import Button from "../Components/Button"
import Error from '../Components/Error'
import ChangePanel from '../Components/ChangePanel'
import Statusbar from '../Components/Statusbar'

//------ MODULE INFO
// This module checks that the admin wants to delete a user.
// Imported by: App

const UserDelete = () => {

    const navigate = useNavigate()

    // get context information
    const { id } = useParams()
    const { setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")

    // validate id
    if (id === undefined || id === "undefined") {
        setErr("undefined")
    }

    // fetch user data from the api
    const [ user, setUser ] = useState({})
    useEffect(() => {
        (async()=>{
            await apiService.singleUser(id, function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setUser(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    // send delete api call
    const confirmDelete = async() => {
        await apiService.deleteUser(user, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus({
                    message: `You have successfully deleted user ${ response.name }.`,
                    error: false
                })
                navigate(`/users`)
            }
        })
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Deleting { user?.name }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/user/${ user?.id }` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                <Statusbar />
                <ChangePanel save={ confirmDelete } linkOut={ `/user/${ user?.id }` } locationId="0" />
            </div>
        </main>
    )
}

export default UserDelete