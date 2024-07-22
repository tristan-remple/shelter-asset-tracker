import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { statusContext } from '../Services/Context'
import authService from '../Services/authService'
import apiService from '../Services/apiService'
import { formattedDate, adminDate } from '../Services/dateHelper'
import handleChanges from '../Services/handleChanges'

import Error from '../Reusables/Error'
import Button from '../Reusables/Button'
import Dropdown from '../Reusables/Dropdown'
import ChangePanel from '../Reusables/ChangePanel'

//------ MODULE INFO
// ** Available for SCSS **
// This module allows the admin to create a new user.
// Imported by: App

const UserCreate = () => {

    // get context information
    const { status, setStatus } = useContext(statusContext)
    const navigate = useNavigate()
    const [ err, setErr ] = useState(null)

    // set up the change panel state
    const [ unsaved, setUnsaved ] = useState(false)

    // form handling state
    const [ changes, setChanges ] = useState({
        name: "",
        isAdmin: false,
        createdAt: "",
        auths: [],
        email: "",
        password: "test",
        authorizedBy: 1
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
                    newChanges.auths = facilityList
                    setChanges(newChanges)
                }
            })
        })()
    }, [])

    const handleLocations = (event, changes, setChanges, setUnsaved) => {
        const fieldName = parseInt(event.target.name)
        const newChanges = {...changes}
        const currentIndex = newChanges.auths.findIndex(loc => loc.id === fieldName)
        newChanges.auths[currentIndex].active = newChanges.auths[currentIndex].active ? false : true
        setChanges(newChanges)
        setUnsaved(true)
    }

    const locationSelector = changes.auths?.map(loc => {
        return (
            <li key={ loc.id }>
                <label htmlFor={ loc.id }>{ loc.name }</label>
                <input 
                    type="checkbox"
                    name={ loc.id } 
                    checked={ loc.active }
                    onChange={ (event) => handleLocations(event, changes, setChanges, setUnsaved) } 
                />
            </li>
        )
    })

    // https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    }

    const saveChanges = () => {
        if (changes.name === "") {
            setStatus("Please enter a name.")
            return
        } else if (changes.email === "" || !validateEmail(changes.email)) {
            setStatus("Please provide a valid email.")
            return
        }

        const newUser = {...changes}
        newUser.auths = newUser.auths.filter(loc => loc.active).map(loc => loc.id)
        console.log(newUser)

        apiService.postNewUser(newUser, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus(`You have successfully added user ${response.name}.`)
                setUnsaved(false)
                navigate(`/user/${response.userId}`)
            }
        })
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
                { status && <div className="row row-info"><p className="my-2">{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            User Name
                        </div>
                        <div className="col-content">
                            <input 
                                type="text" 
                                name="name" 
                                value={ changes.name } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Admin?
                        </div>
                        <div className="col-content">
                            <input 
                                type="checkbox"
                                name="isAdmin" 
                                checked={ changes.isAdmin }
                                onChange={ (event) => handleChanges.handleCheckChange(event, changes, setChanges, setUnsaved) } 
                            />
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
                            Email
                        </div>
                        <div className="col-content">
                            <input 
                                type="email" 
                                name="email" 
                                value={ changes.email } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    {/* <div className="col col-info">
                        <div className="col-head">
                            Password
                        </div>
                        <div className="col-content">
                            <input 
                                type="password" 
                                name="password" 
                                value={ changes.password } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div> */}
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut="/users" /> }
            </div>
        </main>
    )
}

export default UserCreate