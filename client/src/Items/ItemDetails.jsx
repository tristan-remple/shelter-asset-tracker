// external dependencies
import { useParams } from 'react-router-dom'
import { useContext, useState } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import capitalize from '../Services/capitalize'
import { statusContext } from '../Services/Context'

// components
import Button from "../Reusables/Button"
import Flag, { flagTextOptions, flagColorOptions } from "../Reusables/Flag"
import Error from '../Reusables/Error'
import CommentBox from '../Reusables/CommentBox'

//------ MODULE INFO
// This module displays the details about a single item in the collection, such as a stove or a table.
// Imported by: App

const ItemDetails = () => {

    const { id } = useParams()
    const { status } = useContext(statusContext)

    if (id === undefined) {
        console.log("undefined id")
        return <Error err="undefined" />
    }

    const item = apiService.singleItem(id)
    if (!item || item.error) {
        console.log("api error")
        return <Error err="api" />
    }

    const { unit, itemLabel, category, toAssess, toDiscard, vendor, donated, initialValue, currentValue, added, inspected, discardDate, comments } = item

    // if it has been deleted, throw an error
    if (discardDate) {
        return <Error err="deleted" />
    }

    // flag options are defined in the flag module
    let flagColor = flagColorOptions[0]
    let flagText = flagTextOptions[0]
    if ( toDiscard ) {
        flagColor = flagColorOptions[2]
        flagText = flagTextOptions[2]
    } else if ( toAssess ) {
        flagColor  = flagColorOptions[1]
        flagText = flagTextOptions[1]
    }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h1>{ capitalize(category.categoryName) } in { unit.unitName }</h1>
                </div>
                <div className="col-2">
                    <Button text="Edit" linkTo={ `/item/${id}/edit` } type="action" />
                </div>
                <div className="col-3">
                    <Button text="Return" linkTo={ `/unit/${ unit.unitId }` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Label
                        </div>
                        <div className="col-content">
                            { itemLabel }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Item Category
                        </div>
                        <div className="col-content">
                            { category.categoryName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Updated By
                        </div>
                        <div className="col-content">
                            { inspected.firstName } { inspected.lastName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Updated At
                        </div>
                        <div className="col-content">
                            { inspected.inspectedDate }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Status
                        </div>
                        <div className="col-content">
                            <Flag color={ flagColor } />
                            { flagText }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col-2 col-content col-icon">
                        <img className="img-fluid icon" src={ `/img/${ category.icon }.png` } alt={ category.categoryName + " icon" } />
                    </div>
                    <div className="col-8 col-content">
                        <CommentBox comments={ comments } />
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Acquired Date
                        </div>
                        <div className="col-content">
                            { added.addedDate }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Initial Value
                        </div>
                        <div className="col-content">
                            ${ initialValue.toFixed(2) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Current Value
                        </div>
                        <div className="col-content">
                            ${ currentValue.toFixed(2) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Vendor
                        </div>
                        <div className="col-content">
                            { vendor }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Donated
                        </div>
                        <div className="col-content">
                            { donated ? "Yes" : "No" }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            { unit.locationName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit
                        </div>
                        <div className="col-content">
                            { unit.unitName }
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ItemDetails