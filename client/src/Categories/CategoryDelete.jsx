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
// This module checks that the user wants to delete a category.
// Imported by: App

const CategoryDelete = () => {

    // set up page functionality
    const navigate = useNavigate()
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")

    // validate id
    if (id === undefined) {
        setErr("undefined")
    }

    // fetch data from the api
    const [ category, setCategory ] = useState()
    useEffect(() => {
        (async() => {
            await apiService.singleCategory(id, (data) => {
                if (data.error) {
                    setErr(data.error)
                } else {
                    setCategory(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    // confirm that the item should be (soft) deleted
    const confirmDelete = async() => {
        await apiService.deleteCategory(category, (res) => {
            if (res.error) {
                setErr(res.error)
            } else {
                setStatus(`You have successfully deleted category ${ res.name }.`)
                navigate(`/categories`)
            }
        })
    }
    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Deleting { category?.name }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/category/${ category?.id }` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className='my-2'>{ status }</p></div> }
                <ChangePanel save={ confirmDelete } linkOut={ `/category/${ id }` } locationId="0" />
            </div>
        </main>
    )
}

export default CategoryDelete