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

const CategoryDelete = () => {

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
    const category = apiService.singleCategory(id)
    if (!category || category.error) {
        console.log("api error")
        return <Error err="api" />
    }

    // destructure the unit
    const { categoryId, categoryName } = category

    const confirmDelete = () => {
        if (authService.checkUser() && authService.checkAdmin()) {
            const response = apiService.deleteCategory(category)
            if (response.success) {
                setStatus(`You have successfully deleted category ${ response.categoryName }.`)
                navigate(`/categories`)
            } else {
                setStatus("We weren't able to process your delete category request.")
            }
        } else {
            return <Error err="permission" />
        }
    }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Deleting { categoryName }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo={ `/category/${ categoryId }` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <ChangePanel save={ confirmDelete } linkOut={ `/category/${ categoryId }` } locationId="0" />
            </div>
        </main>
    )
}

export default CategoryDelete