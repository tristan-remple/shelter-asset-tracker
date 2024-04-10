// external dependencies
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import capitalize from '../Services/capitalize'
import { friendlyDate } from '../Services/dateHelper'
import { statusContext, authContext } from '../Services/Context'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import Search from '../Reusables/Search'

//------ MODULE INFO
// ** Available for SCSS **
// A list of item categories that is only available to admin users.
// Imported by: App

const CategoryList = () => {

    // get the status from context
    const { status } = useContext(statusContext)
    const [ err, setErr ] = useState(null)

    // check that user is an admin
    // const { isAdmin } = useContext(authContext)
    // if (!isAdmin) {
    //     setErr("permission")
    // }

    // get the categories from the api
    const [ categories, setCategories ] = useState([])
    const [ filteredCategories, setFilteredCategories ] = useState([])
    useEffect(() => {
        (async() => {
            await apiService.listCategories((data) => {
                if (!data || data.error) {
                    setErr("api")
                }
                const sortedData = data.sort((a, b) => {
                    return a.name.localeCompare(b.name)
                })
                setCategories(sortedData)
                setFilteredCategories(sortedData)
            })
        })()
    }, [])

    if (categories) {
    // map the category objects into table rows
    const displayItems = filteredCategories.map(item => {

        return (
            <tr key={ item.id } >
                <td className="col-icon"><img className="small-icon" src={ `/img/${ item.icon }.png` } /></td>
                <td>{ item.name }</td>
                <td className="col-right">${ item.defaultValue }</td>
                <td>{ item.singleResident ? "Yes" : "No" }</td>
                <td><Button text="Details" linkTo={ `/category/${ item.id }` } type="small" /></td>
            </tr>
        )
    })

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>All Categories</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo="/dashboard" type="nav" />
                </div>
                <div className="col-2">
                    <Button text="Add Category" linkTo="/categories/add" type="admin" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <Search data={ categories } setData={ setFilteredCategories } />
                <table className="c-table-info align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Icon</th>
                            <th scope="col">Name</th>
                            <th scope="col">Default Value</th>
                            <th scope="col">Single Resident</th>
                            <th scope="col">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        { displayItems }
                    </tbody>
                </table>
            </div>
        </main>
    )
}
}

export default CategoryList