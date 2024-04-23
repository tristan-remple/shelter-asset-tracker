// external dependencies
import { useParams } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import { statusContext, authContext } from '../Services/Context'
import capitalize from '../Services/capitalize'
import handleChanges from '../Services/handleChanges'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import Search from '../Reusables/Search'
import Flag, { flagTextOptions, flagColorOptions } from "../Reusables/Flag"
import { adminDate } from '../Services/dateHelper'

//------ MODULE INFO
// Displays some stats and reports for the admin.
// Also has some useful admin links.
// Imported by: App

const Dashboard = () => {

    // get context information
    const { id } = useParams()
    const { status } = useContext(statusContext)
    // const [ err, setErr ] = useState("loading")
    const [ err, setErr ] = useState(null)
    let urlId = id

    // fetch unit data from the api
    const [ response, setResponse ] = useState({
        id: 2,
        facility: "Barry House",
        totalValue: 23451.59,
        itemCount: [
            {
                id: 3,
                name: "chair",
                count: 7
            },
            {
                id: 4,
                name: "table",
                count: 3
            },
            {
                id: 5,
                name: "bedframe",
                count: 6
            }
        ],
        units: [
            {
                id: 4,
                name: "Room 204",
                items: [
                    {
                        id: 30,
                        name: "Some Chair",
                        templateId: 3,
                        initialValue: 45,
                        currentValue: 20,
                        donated: false,
                        vendor: "Ikea",
                        depreciationRate: 0.05,
                        eol: "2027-02-22 13:55:00",
                        toDiscard: false,
                        toInspect: false,
                        addedBy: "Susan Ivany",
                        lastInspected: "2024-02-22 13:55:00",
                        lastInspectedBy: "Joe Blow",
                        createdAt: "2024-02-22 13:55:00",
                        updatedAt: "2024-02-22 13:55:00"
                    },
                    {
                        id: 31,
                        name: "Table 2",
                        templateId: 4,
                        initialValue: 75,
                        currentValue: 40,
                        donated: false,
                        vendor: "Brick",
                        depreciationRate: 0.06,
                        eol: "2025-02-22 13:55:00",
                        toDiscard: false,
                        toInspect: true,
                        addedBy: "Susan Ivany",
                        lastInspected: "2024-02-22 13:55:00",
                        lastInspectedBy: "Joe Blow",
                        createdAt: "2024-02-22 13:55:00",
                        updatedAt: "2024-02-22 13:55:00"
                    },
                    {
                        id: 33,
                        name: "Springy",
                        templateId: 5,
                        initialValue: 120,
                        currentValue: 0,
                        donated: false,
                        vendor: "Ikea",
                        depreciationRate: 0.15,
                        eol: "2024-02-22 13:55:00",
                        toDiscard: true,
                        toInspect: true,
                        addedBy: "Susan Ivany",
                        lastInspected: "2024-02-22 13:55:00",
                        lastInspectedBy: "Joe Blow",
                        createdAt: "2024-02-22 13:55:00",
                        updatedAt: "2024-02-22 13:55:00"
                    }
                ]
            },
            {
                id: 4,
                name: "Room 205",
                items: [
                    {
                        id: 34,
                        name: "Some Chair 2",
                        templateId: 3,
                        initialValue: 45,
                        currentValue: 20,
                        donated: false,
                        vendor: "Ikea",
                        depreciationRate: 0.05,
                        eol: "2027-02-22 13:55:00",
                        toDiscard: false,
                        toInspect: true,
                        addedBy: "Susan Ivany",
                        lastInspected: "2024-02-22 13:55:00",
                        lastInspectedBy: "Joe Blow",
                        createdAt: "2024-02-22 13:55:00",
                        updatedAt: "2024-02-22 13:55:00"
                    },
                    {
                        id: 35,
                        name: "Table 5",
                        templateId: 4,
                        initialValue: 75,
                        currentValue: 40,
                        donated: false,
                        vendor: "Brick",
                        depreciationRate: 0.06,
                        eol: "2025-02-22 13:55:00",
                        toDiscard: false,
                        toInspect: true,
                        addedBy: "Susan Ivany",
                        lastInspected: "2024-02-22 13:55:00",
                        lastInspectedBy: "Joe Blow",
                        createdAt: "2024-02-22 13:55:00",
                        updatedAt: "2024-02-22 13:55:00"
                    },
                    {
                        id: 36,
                        name: "Springier",
                        templateId: 5,
                        initialValue: 120,
                        currentValue: 0,
                        donated: false,
                        vendor: "Ikea",
                        depreciationRate: 0.15,
                        eol: "2024-02-22 13:55:00",
                        toDiscard: true,
                        toInspect: true,
                        addedBy: "Susan Ivany",
                        lastInspected: "2024-02-22 13:55:00",
                        lastInspectedBy: "Joe Blow",
                        createdAt: "2024-02-22 13:55:00",
                        updatedAt: "2024-02-22 13:55:00"
                    }
                ]
            }
        ]
    })
    // useEffect(() => {
    //     (async()=>{
    //         if (urlId !== undefined) {
    //             await apiService.singleReport(urlId, function(data){
    //                 if (data.error) {
    //                     setErr(data.error)
    //                 } else {
    //                     setResponse(data)
    //                     setErr(null)
    //                 }
    //             })
    //         } else {
    //             await apiService.globalReport(function(data){
    //                 if (data.error) {
    //                     setErr(data.error)
    //                 } else {
    //                     setResponse(data)
    //                     setErr(null)
    //                 }
    //             })
    //         }
    //     })()
    // }, [])

    // table rows for the upper table: list of categories and number of items in each
    const displayCategories = response?.itemCount.sort((a, b) => {
        return a.count < b.count
    }).map(item => {
        return (
            <tr key={ item.id } >
                <td className="col-icon"><img className="small-icon" src={ `/img/${ item.icon }.png` } /></td>
                <td>{ item.name }</td>
                <td className="col-right">{ item.count }</td>
                <td><Button text="Details" linkTo={ `/category/${ item.id }` } type="small" /></td>
            </tr>
        )
    })

    // list of all items fetched, initially filtered to display items to be discarded only
    const [ discardItems, setDiscardItems ] = useState([])
    const [ filteredItems, setFilteredItems ] = useState([])
    useEffect(() => {
        const totalDiscardItems = response.units.reduce((itemList, unit) => {
            itemList.push(...unit.items)
            return itemList
        }, [])
        setDiscardItems(totalDiscardItems)
        setFilteredItems(totalDiscardItems.filter(item => {
            return item.toDiscard
        }))
    }, [ response ])

    // possible filter criteria
    const [ unsaved, setUnsaved ] = useState(false)
    const [ filters, setFilters ] = useState({
        startDate: `${new Date().getFullYear()}-01-01`,
        endDate: `${new Date().getFullYear()}-12-31`,
        inspect: false,
        discard: true
    })

    // when filters are updated, update the items listed
    useEffect(() => {
        const newFilters = discardItems.filter(item => {
            return (
                new Date(item.eol) > new Date(filters.startDate) &&
                new Date(item.eol) < new Date(filters.endDate) &&
                (filters.discard ? item.toDiscard : true) &&
                (filters.inspect ? item.toInspect || item.toDiscard : true)
            )
        })
        setFilteredItems(newFilters)
    }, [ filters ])

    // render the filtered items as table rows for the lower table
    const displayItems = filteredItems?.map(item => {
        return (
            <tr key={ item.id } >
                <td>{ item.name }</td>
                {/* <td>{ capitalize(item.template.name) }</td> */}<td></td>
                <td><Button text="Details" linkTo={ `/item/${ item.id }` } type="small" /></td>
                <td>{ adminDate(item.eol) }</td>
            </tr>
        )
    })

    // https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Admin Dashboard</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Categories" linkTo="/categories" type="admin" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Users" linkTo="/users" type="admin" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Locations" linkTo="/locations" type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className='my-2'>{ status }</p></div> }
                <div className="row">
                    <div className="col-4">
                        <h4>Overview</h4>
                        <div className="row row-info">
                            <div className="col col-info">
                                <div className="col-head">
                                    Location
                                </div>
                                <div className="col-content">
                                    { response.facility }
                                </div>
                                <div className="col-head">
                                    Total Value
                                </div>
                                <div className="col-content">
                                    $ { response.totalValue.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
                                </div>
                                <div className="col-head">
                                    CSV Exports
                                </div>
                                <div className="col-content">
                                    <Button text="Financial Report" linkTo={ `/item` } type="small" />
                                </div>
                                <div className="col-content">
                                    <Button text="Detailed Report" linkTo={ `/item` } type="small" />
                                </div>
                                <div className="col-content">
                                    <Button text="Replacements Report" linkTo={ `/item` } type="small" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <h4>Item Counts</h4>
                        <table className="c-table-info align-middle">
                            <thead>
                                <tr>
                                    <th scope="col">Icon</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Count</th>
                                    <th scope="col">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                { displayCategories }
                            </tbody>
                        </table>
                    </div>
                </div>
                <h4>Items to Discard Soon</h4>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            End of Life Start Date
                        </div>
                        <div className="col-content">
                            { <input 
                                type="date" 
                                name="startDate" 
                                value={ filters.startDate } 
                                onChange={ (event) => handleChanges.handleDateChange(event, filters, setFilters, setUnsaved) } 
                            /> }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            End of Life End Date
                        </div>
                        <div className="col-content">
                            { <input 
                                type="date" 
                                name="endDate" 
                                value={ filters.endDate } 
                                onChange={ (event) => handleChanges.handleDateChange(event, filters, setFilters, setUnsaved) } 
                            /> }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Items to Inspect Only
                        </div>
                        <div className="col-content">
                            <input 
                                type="checkbox"
                                name="inspect" 
                                checked={ filters.inspect } 
                                onChange={ (event) => handleChanges.handleCheckChange(event, filters, setFilters, setUnsaved) }  
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Items to Discard Only
                        </div>
                        <div className="col-content">
                            <input 
                                type="checkbox"
                                name="discard" 
                                checked={ filters.discard } 
                                onChange={ (event) => handleChanges.handleCheckChange(event, filters, setFilters, setUnsaved) } 
                            />
                        </div>
                    </div>
                </div>
                <Search data={ discardItems } setData={ setFilteredItems } />
                <table className="c-table-info align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Label</th>
                            <th scope="col">Category</th>
                            <th scope="col">Details</th>
                            <th scope="col">End of Life</th>
                        </tr>
                    </thead>
                    <tbody>
                        { displayItems ? displayItems : <td colSpan={ 4 }>No items yet.</td> }
                    </tbody>
                </table>
            </div> {/* page content */}
        </main>
    )
}

export default Dashboard