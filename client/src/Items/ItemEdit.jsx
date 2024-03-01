// external dependencies
import { useState } from 'react'
import { useParams } from 'react-router-dom'

// internal dependencies
import apiService from "../Services/apiService"
import capitalize from '../Services/capitalize'

// components
import Button from "../Reusables/Button"
import Flag from "../Reusables/Flag"
import Error from '../Reusables/Error'
import Dropdown from '../Reusables/Dropdown'

//------ MODULE INFO
// This module allows a user to edit the details about a single item in the collection.
// Imported by: App

const ItemEdit = () => {

    const { id } = useParams()

    if (id === undefined) {
        console.log("undefined id")
        return <Error err="undefined" />
    }

    const item = apiService.singleItem(id)
    if (item.error) {
        console.log("api error")
        return <Error err="api" />
    }

    const { unit, itemLabel, category, toAssess, toDiscard, vendor, donated, initialValue, currentValue, added, inspected, discardDate, comment } = item

    const flagOptions = [ "OK", "Assess", "Discard" ]
    const possibleFlags = [ "grey", "yellow", "red" ]

    let flagColor = possibleFlags[0]
    let flagText = flagOptions[0]
    if ( toDiscard ) {
        flagColor = possibleFlags[2]
        flagText = flagOptions[2]
    } else if ( toAssess ) {
        flagColor  = possibleFlags[1]
        flagText = flagOptions[1]
    }

    const [ dangerMode, setDangerMode ] = useState(false)

    const [ safeChanges, setSafeChanges ] = useState({
        label: itemLabel,
        statusColor: flagColor,
        statusText: flagText,
        comment: comment
    })

    const [ dangerChanges, setDangerChanges ] = useState({
        category,
        inspected,
        added,
        initialValue,
        currentValue,
        vendor,
        donated,
        unit,
        discardDate
    })

    const handleTextChange = (event) => {
        const fieldName = event.target.name
        const newChanges = {...safeChanges}
        newChanges[fieldName] = event.target.value
        setSafeChanges(newChanges)
    }

    const handleFlag = (input) => {
        const newChanges = {...safeChanges}
        const index = flagOptions.indexOf(input)
        if (index > -1) {
            newChanges.statusColor = possibleFlags[index]
            newChanges.statusText = flagOptions[index]
        }
        setSafeChanges(newChanges)
    }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col-6">
                    <h1>Editing { capitalize(category.categoryName) } in { unit.unitName }</h1>
                </div>
                <div className="col-2">
                    <Button text="Save Changes" linkTo={ `/item/${id}` } type="action" />
                </div>
                <div className="col-2">
                    <Button text="Cancel Edit" linkTo={ `/item/${id}` } type="nav" />
                </div>
                <div className="col-2">
                    <Button text="Advanced Edit" linkTo={ `/item/${id}` } type="danger" />
                </div>
            </div>
            <div className="page-content">
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Label
                        </div>
                        <div className="col-content">
                            <input type="text" name="label" value={ safeChanges.label } onChange={ handleTextChange } />
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
                            <Flag color={ safeChanges.statusColor } />
                            <Dropdown
                                list={ flagOptions }
                                current={ safeChanges.statusText }
                                setCurrent={ handleFlag }
                            />
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col-2 col-content col-icon">
                        <img className="img-fluid icon" src={ `/img/${ category.categoryIcon }.png` } alt={ category.categoryName + " icon" } />
                    </div>
                    <div className="col-8 col-content">
                        <strong>Comments:</strong>
                        <textarea name="comment" value={ safeChanges.comment } onChange={ handleTextChange } className="comment-area" />
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

export default ItemEdit