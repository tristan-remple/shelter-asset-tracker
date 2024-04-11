// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'

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
// This module checks that the user wants to delete a category.
// Imported by: App

const CategoryDelete = () => {

    const navigate = useNavigate()

    // get context information
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState(null)
    
    if (!authService.checkAdmin()) {
        setErr("permission")
    }

    // validate id
    if (id === undefined) {
        setErr("undefined")
    }

    // fetch data from the api
    const [ category, setCategory ] = useState()
    useEffect(() => {
        (async() => {
            await apiService.singleCategory(id, (data) => {
                if (!data || data.error) {
                    setErr("api")
                } else {
                    setCategory(data)
                }
            })
        })()
    }, [])

    const confirmDelete = async() => {
        if (authService.checkUser() && authService.checkAdmin()) {
            await apiService.deleteCategory(category, (res) => {
                if (res.success) {
                    setStatus(`You have successfully deleted category ${ res.name }.`)
                    navigate(`/categories`)
                } else {
                    setStatus("We weren't able to process your delete category request.")
                }
            })
        } else {
            return <Error err="permission" />
        }
    }

    if (category) {
    return (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Deleting { category.name }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/category/${ category.id }` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className='my-2'>{ status }</p></div> }
                <ChangePanel save={ confirmDelete } linkOut={ `/category/${ id }` } locationId="0" />
            </div>
        </main>
    )
}
}

export default CategoryDelete