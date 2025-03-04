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
// This module displays a list of deleted categories, and allows the user to restore them.
// Imported by: App
// Navigated from: Dashboard

const CategoryRecovery = () => {

    // get context information
    const { setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")

    // fetch data from the api
    const [ categories, setCategories ] = useState({})
    const [ filteredCategories, setFilteredCategories ] = useState([])
    useEffect(() => {
        (async()=>{
            await apiService.deletedCategories(function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setCategories(data)
                    setFilteredCategories(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    // if there's an api error, display the error page
    if (err) { return <Error err={ err } /> }
    if (categories) {

    // order the items by most recently deleted first
    categories?.sort((a, b) => {
        return new Date(b.deletedAt) - new Date(a.deletedAt)
    })
    filteredCategories?.sort((a, b) => {
        return new Date(b.deletedAt) - new Date(a.deletedAt)
    })

    // send an api call to restore the item
    const restoreCategory = async(categoryId) => {
        await apiService.restoreItem(categoryId, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus({
                    message: `You have successfully restored category ${response.name}.`,
                    error: false
                })
            }
        })
    } 

    // map the item objects into table rows
    const displayItems = filteredCategories?.map(category => {
        return (
            <tr key={ category.id } >
                <td>{ category.name }</td>
                <td>{ adminDate(category.deletedat) }</td>
                <td><Button text="Restore" linkTo={ () => restoreCategory(category.id) } type="small" /></td>
            </tr>
        )
    })

    const hardDelete = async() => {
        if (confirm("Once you empty deleted categories, you will not be able to recover them. Are you sure?")) {
            await apiService.emptyDeletedCetagories((data) => {
                if (data.error) {
                    setStatus({
                        message: "We were not able to empty the deleted categories.",
                        error: false
                    })
                } else {
                    setStatus({
                        message: "All deleted categories have been purged from the system.",
                        error: false
                    })
                }
            })
        }
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Deleted Categories</h2>
                </div>
                <div className="col d-flex justify-content-end">
                    {/* <Button text="Empty Deleted Categories" linkTo={ hardDelete } type="admin" /> */}
                    <Button text="Return" linkTo={ `/admin` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                <Statusbar />
                <Search data={ categories } setData={ setFilteredCategories } />
                <table className="c-table-info align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
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

export default CategoryRecovery