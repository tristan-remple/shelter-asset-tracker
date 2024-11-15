// external dependencies
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import { adminDate } from '../Services/dateHelper'
import { statusContext } from '../Services/Context'

// components
import Button from "../Components/Button"
import Error from '../Components/Error'
import Search from '../Components/Search'
import Statusbar from '../Components/Statusbar'

//------ MODULE INFO
// This module displays a list of deleted users, and allows the user to restore them.
// Imported by: App

const UserRecovery = () => {

    // get context information
    const { setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")

    // fetch data from the api
    const [ users, setUsers ] = useState({})
    const [ filteredUsers, setFilteredUsers ] = useState([])
    useEffect(() => {
        (async()=>{
            await apiService.deletedUsers(function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setUsers(data)
                    setFilteredUsers(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    if (err) { return <Error err={ err } /> }
    if (users) {

    // order the items by most recently deleted first
    users?.sort((a, b) => {
        return new Date(b.deletedAt) - new Date(a.deletedAt)
    })
    filteredUsers?.sort((a, b) => {
        return new Date(b.deletedAt) - new Date(a.deletedAt)
    })

    // send an api call to restore the item
    const restoreUser = async(userId) => {
        await apiService.restoreItem(userId, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus({
                    message: `You have successfully restored user ${response.name}.`,
                    error: false
                })
            }
        })
    } 

    // map the item objects into table rows
    const displayItems = filteredUsers?.map(user => {
        return (
            <tr key={ user.id } >
                <td>{ user.name }</td>
                <td>{ adminDate(user.deletedAt) }</td>
                <td><Button text="Restore" linkTo={ () => restoreUser(user.id) } type="small" /></td>
            </tr>
        )
    })

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Deleted Users</h2>
                </div>
                <div className="col-1 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/admin` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                <Statusbar />
                <Search data={ users } setData={ setFilteredUsers } />
                <table className="c-table-info align-middle">
                    <thead>
                        <tr>
                            <th scope="col">User</th>
                            <th scope="col">Deleted Date</th>
                            <th scope="col">Restore</th>
                        </tr>
                    </thead>
                    <tbody>
                        { displayItems ? displayItems : <td colSpan={ 3 }>No items yet.</td> }
                    </tbody>
                </table>
            </div>
        </main>
    )
}
}

export default UserRecovery