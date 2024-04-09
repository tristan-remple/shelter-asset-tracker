// external dependencies
import { useContext, useState } from 'react'
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

    // get the status from context
    const { id } = useParams()
    const { status } = useContext(statusContext)

    // validate id
    if (id === undefined) {
        console.log("undefined id")
        return <Error err="undefined" />
    }

    // fetch unit data from the api
    const response = apiService.singleCategory(id)
    if (!response || response.error) {
        console.log("api error")
        return <Error err="api" />
    }

    // destructure response
    const { categoryId, categoryName, defaultValue, defaultUsefulLife, icon, singleUse, items, created, updated } = response

    

    return (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>{ capitalize(categoryName) } Category</h2>
                </div>
                <div className="col-2">
                    <Button text="See All" linkTo="/categories" type="nav" />
                </div>
                <div className="col-2">
                    <Button text="Edit" linkTo={ `/category/${ categoryId }/edit` } type="admin" />
                </div>
                <div className="col-2">
                    <Button text="Delete" linkTo={ `/category/${ categoryId }/delete` } type="admin" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Name
                        </div>
                        <div className="col-content">
                            { categoryName }
                        </div>
                    </div>
                    
                    <div className="col col-info">
                        <div className="col-head">
                            Single Use
                        </div>
                        <div className="col-content">
                            { singleUse ? "Yes" : "No" }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Updated
                        </div>
                        <div className="col-content">
                            { friendlyDate(updated) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Added
                        </div>
                        <div className="col-content">
                            { friendlyDate(created) }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Default Value
                        </div>
                        <div className="col-content">
                            { `$${ defaultValue.toFixed(2) }` }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Default Useful Life
                        </div>
                        <div className="col-content">
                            { `${( defaultUsefulLife / 4 )} years` }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            # of Items
                        </div>
                        <div className="col-content">
                            { items }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Icon
                        </div>
                        <div className="col-icon col-content">
                            <img className="img-fluid small-icon" src={ `/img/${ icon }.png` } alt={ categoryName + " icon" } />
                            <Button text="Change Icon" linkTo={ `/category/${ id }/edit` } type="admin" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CategoryDetails