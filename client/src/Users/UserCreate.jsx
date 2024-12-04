// external dependencies
import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// internal dependencies
import { statusContext } from '../Services/Context'
import apiService from '../Services/apiService'
import handleChanges from '../Services/handleChanges'

// components
import Error from '../Components/Error'
import Button from '../Components/Button'
import ChangePanel from '../Components/ChangePanel'
import Checkbox from '../Components/Checkbox'
import Statusbar from '../Components/Statusbar'
import RegularField from '../Components/RegularField'

//------ MODULE INFO
// This module allows the admin to create a new user.
// Imported by: App

const UserCreate = () => {

    // get context information
    const { setStatus } = useContext(statusContext)
    const navigate = useNavigate()
    const [ err, setErr ] = useState(null)
    const [ forceValidation, setForceValidation ] = useState(0)

    // set up the change panel state
    const [ unsaved, setUnsaved ] = useState(false)

    // form handling state
    const [ changes, setChanges ] = useState({
        name: "",
        isAdmin: false,
        createdAt: "",
        email: "",
        password: "test",
        authorizedBy: 1,
        facilities: [],
        errorFields: []
    })

    // list of locations for dropdown
    useEffect(() => {
        (async()=>{
            await apiService.listLocations(function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    const newChanges = {...changes}
                    const facilityList = data.map(loc => {
                        loc.active = false
                        return loc
                    })
                    newChanges.facilities = facilityList
                    setChanges(newChanges)
                }
            })
        })()
    }, [])

    // handle toggles to the location auth checkboxes
    const handleLocations = (event) => {
        const fieldName = event.target.id ? parseInt(event.target.id) : parseInt(event.target.parentNode.id)
        const newChanges = {...changes}
        const currentIndex = newChanges.facilities.findIndex(loc => loc.id === fieldName)
        newChanges.facilities[currentIndex].active = newChanges.facilities[currentIndex].active ? false : true
        setChanges(newChanges)
        setUnsaved(true)
    }

    const locationSelector = changes.facilities?.map(loc => {
        return (
            <li key={ loc.id }>
                <Checkbox 
                    id={ loc.id } 
                    name={ loc.name } 
                    checked={ loc.active } 
                    changeHandler={ (event) => handleLocations(event) } 
                />
            </li>
        )
    })

    const handleAdmin = () => {
        const newChanges = {...changes}
        newChanges.isAdmin = changes.isAdmin ? false : true
        setChanges(newChanges)
    }

    const [ confirm, setConfirm ] = useState(false)

    const saveChanges = () => {
        if (changes.name === "" || changes.email === "" || changes.errorFields.length > 0) {
            setForceValidation(forceValidation + 1)
            setStatus({
                message: "Please make sure that you have filled in all required fields correctly.",
                error: true
            })
            return
        }

        if (changes.isAdmin && !confirm) {
            setStatus({
                message: "Granting a user admin privileges is a serious action. If you're sure you wish to proceed, click save again.",
                error: true
            }),
            setConfirm(true)
            return
        } 
        
        if (!changes.facilities.some(loc => loc.active) && !confirm) {
            setStatus({
                message: "This user has no locations assigned. They will not be able to view or edit any information on the app. You can assign them to locations by clicking the checkboxes beside the location names. If you're sure you wish to proceed, click save again.",
                error: true
            })
            setConfirm(true)
            return
        }

        const newUser = {...changes}
        newUser.auths = newUser.facilities.filter(loc => loc.active).map(loc => loc.id)

        apiService.postNewUser(newUser, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus({
                    message: `You have successfully added user ${response.name}.`,
                    error: false
                })
                setUnsaved(false)
                navigate(`/user/${response.userId}`)
            }
        })
    }

    const formControls = { 
        changes, setChanges, unsaved, setUnsaved, 
        force: forceValidation
    }

    if (err) { return <Error err={ err } /> }
    return (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Add New User</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo="/users" type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Save" linkTo={ saveChanges } type="admin" />
                </div>
            </div>
            <div className="page-content">
                <Statusbar />
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Name *
                        </div>
                        <div className="col-content">
                            <RegularField 
                                type="text"
                                name="name"
                                formControls={ formControls }
                                required={ true }
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Grant Admin?
                        </div>
                        <div className="col-content">
                            <Checkbox
                                id="admin"
                                name="Grant Admin" 
                                checked={ changes.isAdmin }
                                changeHandler={ handleAdmin } 
                            />
                            <p>
                                <br />
                                Setting a user to admin allows them full access to everything. This includes the ability to edit other users and change the admin status of other users. It also includes the ability to view the dashboard and create, edit, and delete templates, locations, and units.
                                <br /><br />
                                Be careful who you grant this role to, and make sure at least one person is an admin.
                            </p>
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            <ul>
                                { locationSelector }
                            </ul>
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Email *
                        </div>
                        <div className="col-content">
                            <RegularField 
                                type="email"
                                name="email"
                                formControls={ formControls }
                                required={ true }
                            />
                        </div>
                    </div>
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut="/users" /> }
            </div>
        </main>
    )
}

export default UserCreate