import { useParams } from 'react-router-dom'
import { useContext } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import capitalize from '../Services/capitalize'
import friendlyDate from '../Services/friendlyDate'
import { statusContext } from '../Services/Context'

// components
import Button from "../Reusables/Button"
import Flag, { flagTextOptions, flagColorOptions } from "../Reusables/Flag"
import Error from '../Reusables/Error'

//------ MODULE INFO
// This module displays the details about a single unit inside of a building. Examples include apartments and snugs.
// The items within the unit are displayed as well.
// Imported by: App

const UnitDetails = () => {

    // get context information
    const { id } = useParams()
    const { status } = useContext(statusContext)

    // validate id
    if (id === undefined) {
        console.log("undefined id")
        return <Error err="undefined" />
    }

    // fetch unit data from the api
    const response = apiService.unitItems(id)
    if (response.error) {
        console.log("api error")
        return <Error err="api" />
    }

    // destructure api response
    const { unit, items } = response
    const { unitId, unitName, locationId, locationName, unitType, added, inspected, deleteDate, comment } = unit

    // put the items that need to be assessed or discarded at the top of the list
    items.sort((a, b) => {
        return a.toAssess < b.toAssess ? 1 : 0
    }).sort((a, b) => {
        return a.toDiscard < b.toDiscard ? 1 : 0
    })

    // map the item objects into table rows
    const displayItems = items.map(item => {

        // flag options are defined in the flag module
        let flagColor = flagColorOptions[0]
        let flagText = flagTextOptions[0]
        if ( item.toDiscard ) {
            flagColor = flagColorOptions[2]
            flagText = flagTextOptions[2]
        } else if ( item.toAssess ) {
            flagColor  = flagColorOptions[1]
            flagText = flagTextOptions[1]
        }

        return (
            <tr key={ item.itemId } >
                <td>{ item.itemLabel }</td>
                <td>{ capitalize(item.categoryName) }</td>
                <td><Button text="Details" linkTo={ `/item/${ item.itemId }` } type="small" /></td>
                <td><Flag color={ flagColor } /> { flagText }</td>
            </tr>
        )
    })

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col-6">
                    <h2>Unit { unitName } in { locationName }</h2>
                </div>
                <div className="col-2">
                    <Button text="Add Item" linkTo={ `/unit/${ unitId }/additem` } type="action" />
                </div>
                <div className="col-3">
                    <Button text="Return" linkTo={ `/location/${ locationId }` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            { locationName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit Name
                        </div>
                        <div className="col-content">
                            { unitName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit Type
                        </div>
                        <div className="col-content">
                            { capitalize(unitType) }
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
                            { friendlyDate(inspected.inspectedDate) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Added
                        </div>
                        <div className="col-content">
                            { friendlyDate(added.addedDate) }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col-8 col-content">
                        <p>
                            <strong>Comments:</strong><br />
                            { comment }
                        </p>
                    </div>
                </div>
                <table className="c-table-info align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Label</th>
                            <th scope="col">Category</th>
                            <th scope="col">Details</th>
                            <th scope="col">Status</th>
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

export default UnitDetails