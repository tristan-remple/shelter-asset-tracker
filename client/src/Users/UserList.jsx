// external dependencies
import { useContext, useState } from "react"

// internal dependencies
import { statusContext } from '../Services/Context'
import authService from "../Services/authService"
import apiService from "../Services/apiService"
import { adminDate } from "../Services/dateHelper"

// components
import Error from "../Reusables/Error"
import Button from "../Reusables/Button"
import Search from "../Reusables/Search"

//------ MODULE INFO
// ** Available for SCSS **
// This module shows a list of users to the admin.
// Imported by: App

const UserList = () => {

    // get the status from context
    const { status } = useContext(statusContext)

    // check that user is an admin
    if (!authService.checkAdmin()) {
        console.log("insufficient permission")
        return <Error err="permission" />
    }

    // get the users from the api
    const users = apiService.listUsers()
    if (!users || users.error) {
        return <Error err="api" />
    }

    // sort by date added
    users.sort((a, b) => {
        return new Date(b.created) - new Date(a.created)
    })

    // enable search functionality
    const [ filteredUsers, setFilteredUsers ] = useState(users)

    // render user rows
    const displayUsers = filteredUsers.map(user => {
        return <tr key={ user.userId } >
            <td>{ user.userName }</td>
            <td>{ user.location.locationName }</td>
            <td>{ adminDate(user.created) }</td>
            <td><Button text="Details" linkTo={ `/user/${ user.userId }` } type="small" /></td>
        </tr>
    })

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>All Users</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo="/admin" type="admin" />
                </div>
                <div className="col-2">
                    <Button text="Add User" linkTo="/users/add" type="admin" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <Search data={ users } setData={ setFilteredUsers } />
                <table className="c-table-info align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Username</th>
                            <th scope="col">Location</th>
                            <th scope="col">Date Added</th>
                            <th scope="col">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        { displayUsers }
                    </tbody>
                </table>
            </div>
        </main>
    )
}

export default UserList