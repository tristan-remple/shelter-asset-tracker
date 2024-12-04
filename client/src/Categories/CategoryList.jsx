// external dependencies
import { useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"

// components
import Button from "../Components/Button"
import Error from '../Components/Error'
import Search from '../Components/Search'
import Statusbar from '../Components/Statusbar'

//------ MODULE INFO
// Lists the possible categories that items can fall into.
// Imported by: App
// Navigated from: Dashboard
// Navigates to: CategoryDetails, CategoryCreate

const CategoryList = () => {

    // get the status from context
    const [ err, setErr ] = useState("loading")

    // get the categories from the api
    const [ categories, setCategories ] = useState([])
    const [ filteredCategories, setFilteredCategories ] = useState([])
    useEffect(() => {
        (async() => {
            await apiService.listCategories((data) => {
                if (data.error) {
                    setErr(data.error)
                } else {
                    const sortedData = data.sort((a, b) => {
                        return a.name.localeCompare(b.name)
                    })
                    setCategories(sortedData)
                    setFilteredCategories(sortedData)
                    setErr(null)
                }
            })
        })()
    }, [])

    // map the category objects into table rows
    const displayItems = filteredCategories?.map(item => {

        return (
            <tr key={ item.id } >
                <td className="col-icon">
                    <img className="small-icon" src={ `/img/${ item.Icon.src }` } alt={ `${ item.Icon.name } icon` } />
                </td>
                <td>{ item.name }</td>
                <td className="col-right">${ item.defaultValue }</td>
                <td>{ item.singleResident ? "Yes" : "No" }</td>
                <td><Button text="Details" linkTo={ `/category/${ item.id }` } type="small" /></td>
            </tr>
        )
    })

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>All Categories</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo="/admin" type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Add Category" linkTo="/categories/add" type="admin" />
                </div>
            </div>
            <div className="page-content">
                <Statusbar />
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

export default CategoryList