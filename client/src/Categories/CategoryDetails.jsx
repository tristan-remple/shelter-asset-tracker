// external dependencies
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

// internal dependencies
import apiService from "../Services/apiService"
import capitalize from '../Services/capitalize'
import { friendlyDate } from '../Services/dateHelper'

// components
import Button from "../Components/Button"
import Error from '../Components/Error'
import Statusbar from '../Components/Statusbar'

//------ MODULE INFO
// Displays the information about a single category.
// Imported by: App
// Navigated from: CategoryList

const CategoryDetails = () => {

    // set up page functionality
    const { id } = useParams()
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
            </div>
            <div className="page-content">
                <Statusbar />
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
                            { response.singleresident ? "Yes" : "No" }
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
                    {/* <div className="col col-info">
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
                    </div> */}
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Default Useful Life
                        </div>
                        <div className="col-content">
                            { response.defaultusefullife } months<br />
                            Equivalent to { (response.defaultusefullife / 12).toFixed(1) } years
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Default Value
                        </div>
                        <div className="col-content">
                            { `$${ response.defaultvalue }` }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Icon
                        </div>
                        <div className="col-icon col-content">
                            <img className="img-fluid small-icon" src={ `/img/${ response.iconAssociation.src }` } alt={ response.iconAssociation.name + " icon" } />
                            <Button text="Change Icon" linkTo={ `/category/${ response.id }/edit` } type="admin" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CategoryDetails