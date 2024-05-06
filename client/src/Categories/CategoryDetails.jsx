// external dependencies
import { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

// internal dependencies
import apiService from "../Services/apiService"
import { statusContext, authContext } from '../Services/Context'
import capitalize from '../Services/capitalize'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import { friendlyDate } from '../Services/dateHelper'

//------ MODULE INFO
// ** Available for SCSS **
// The information about a single category.
// Imported by: App

const CategoryDetails = () => {

    // set up page functionality
    const { id } = useParams()
    const { status } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")

    // validate id
    if (id === undefined) {
        setErr("undefined")
    }

    // fetch data from the api
    const [ response, setResponse ] = useState()
    useEffect(() => {
        (async() => {
            await apiService.singleCategory(id, (data) => {
                if (data.error) {
                    setErr(data.error)
                } else {
                    setResponse(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>{ capitalize(response.name) } Category</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="See All" linkTo="/categories" type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Edit" linkTo={ `/category/${ response.id }/edit` } type="admin" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Delete" linkTo={ `/category/${ response.id }/delete` } type="danger" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className='my-2'>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Name
                        </div>
                        <div className="col-content">
                            { response.name }
                        </div>
                    </div>
                    
                    <div className="col col-info">
                        <div className="col-head">
                            Single Resident
                        </div>
                        <div className="col-content">
                            { response.singleResident ? "Yes" : "No" }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Updated
                        </div>
                        <div className="col-content">
                            { friendlyDate(response.updatedAt) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Created
                        </div>
                        <div className="col-content">
                            { friendlyDate(response.createdAt) }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Default Value
                        </div>
                        <div className="col-content">
                            { `$${ parseFloat(response.defaultValue).toFixed(2) }` }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Default Depreciation Rate
                        </div>
                        <div className="col-content">
                            { response.defaultDepreciation }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            # of Items
                        </div>
                        <div className="col-content">
                            { response.itemCount }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Icon
                        </div>
                        <div className="col-icon col-content">
                            <img className="img-fluid small-icon" src={ `/img/${ response.Icon.src }` } alt={ response.Icon.name + " icon" } />
                            <Button text="Change Icon" linkTo={ `/category/${ response.id }/edit` } type="admin" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CategoryDetails