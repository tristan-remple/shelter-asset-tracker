// external dependencies
import { useParams } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import capitalize from '../Services/capitalize'
import { friendlyDate } from '../Services/dateHelper'
import { statusContext } from '../Services/Context'

// components
import Button from "../Components/Button"
import Flag, { flagOptions } from "../Components/Flag"
import Error from '../Components/Error'
import CommentBox from '../Components/CommentBox'

//------ MODULE INFO
// ** Available for SCSS **
// This module displays the details about a single item in the collection, such as a stove or a table.
// Imported by: App

const ItemDetails = () => {

    // get the id and status
    const { id } = useParams()
    const { status } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")

    // if no id has been provided, throw an error
    if (id === undefined) {
        setErr("undefined")
    }

    // fetch data from the api
    const [ item, setItem ] = useState()
    useEffect(() => {
        (async()=>{
            await apiService.singleItem(id, function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setItem(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    if (err) { return <Error err={ err } /> }
    if (item) {

    // destructure the item object
    const { unit, name, template, status: itemStatus, value, createdAt, eol, inspectionRecord, invoice, vendor } = item

    // if it has been deleted, throw an error
    // if (discardDate) {
    //     return <Error err="deleted" />
    // }

    // flag options are defined in the flag module
    let currentFlag = flagOptions.filter(option => {
        return option.text.toLowerCase() === itemStatus
    })[0]
    
    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h1 className=" mt-3">{ capitalize(template.name) } in { unit.name }</h1>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/unit/${ unit.id }` } type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button  text="Inspect" linkTo={ `/item/${id}/inspect` } type="action" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button  text="Edit" linkTo={ `/item/${id}/edit` } type="action" />
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
                            { name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Item Category
                        </div>
                        <div className="col-content">
                            { template.name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            { unit.facility.name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit
                        </div>
                        <div className="col-content">
                            { unit.name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Status
                        </div>
                        <div className="col-content">
                            <Flag color={ currentFlag.color } />
                            { currentFlag.text }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col-2 col-content col-icon">
                        { template.icon ? <img className="img-fluid icon" src={ `/img/${ template.icon.src }` } alt={ template.icon.name + " icon" } /> : "No Icon" }
                        
                    </div>
                    <div className="col-8 col-content">
                        <CommentBox comments={ inspectionRecord } />
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Acquired Date
                        </div>
                        <div className="col-content">
                            { friendlyDate(createdAt) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Expected End of Life
                        </div>
                        <div className="col-content">
                            { friendlyDate(eol) }
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
                            Invoice Number
                        </div>
                        <div className="col-content">
                            { invoice }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Initial Value
                        </div>
                        <div className="col-content">
                            ${ parseFloat(value.initialValue).toFixed(2) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Current Value
                        </div>
                        <div className="col-content">
                            ${ parseFloat(value.currentValue).toFixed(2) }
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
}

export default ItemDetails