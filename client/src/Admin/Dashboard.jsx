// external dependencies
import { useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect, useRef } from 'react'
import { CSVLink } from 'react-csv'

// internal dependencies
import apiService from "../Services/apiService"
import { statusContext } from '../Services/Context'
import capitalize from '../Services/capitalize'
import handleChanges from '../Services/handleChanges'
import { adminDate } from '../Services/dateHelper'

// components
import Button from "../Components/Button"
import Error from '../Components/Error'
import Search from '../Components/Search'
import Dropdown from '../Components/Dropdown'
import Checkbox from '../Components/Checkbox'
import Statusbar from '../Components/Statusbar'

//------ MODULE INFO
// This page is the main page for admin functionality.
// * Access to the Settings, Categories, Users, and Restore Deleted pages.
// * Quick stats about the value and type of items, in total or per location.
// * List of items that might need to be replaced soon, with adjustable filters.
// Imported by: App
// Navigated from: Header
// Navigates to: Settings, CategoryList, UserList, RestoreItems, RestoreUnits, RestoreLocations, RestoreCategories

const Dashboard = () => {

    // get context information
    const { status, setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")
    const navigate = useNavigate()

    // viewOptions: list of location names to filter by dropdown
    // view: currently selected location
    const [ viewOptions, setViewOptions ] = useState([])
    const [ view, setView ] = useState("All Locations")
    
    // fetch unit data from the api
    const [ response, setResponse ] = useState()

    useEffect(() => {
        (async()=>{
            await apiService.globalReport(function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setResponse(data)
                    const viewOpt = data.map(loc => loc.facility)
                    viewOpt.unshift("All Locations")
                    setViewOptions(viewOpt)
                    setErr(null)
                }
            })
        })()
    }, [])

    // state to hold the information about the currently selected view
    const [ items, setItems ] = useState([]) // all items in all facilities
    const [ filteredItems, setFilteredItems ] = useState([]) // items that meet the current filter criteria
    const [ totalValue, setTotalValue ] = useState(0)
    const [ itemCount, setItemCount ] = useState([])

    useEffect(() => {

        // if the api call has been completed successfully and the view is set to all
        if (view === "All Locations" && response?.length > 0) {

            // initialize arrays and count
            let newItemList = []
            let newItemCount = []
            let newTotalValue = 0

            // loop through the locations
            response.forEach(loc => {

                // add the items from each unit to the total
                newItemList = loc.units.reduce((newItemList, unit) => {
                    newItemList.push(...unit.items)
                    return newItemList
                }, newItemList)
                
                // tally up the category counts
                newItemCount = loc.itemCount.reduce((newItemCount, cat) => {

                    // check if the tally for this category is initialized
                    // add to it if it exists; pass forward existing categories
                    const matchingCat = newItemCount.filter(newCat => newCat.id === cat.id)[0]
                    if (matchingCat) {
                        newItemCount = newItemCount.map(newCat => {
                            if (newCat.id === cat.id) {
                                return {
                                    id: newCat.id,
                                    name: newCat.name,
                                    count: newCat.count + cat.count,
                                    icon: newCat.icon
                                }
                            } else {
                                return newCat
                            }
                        })
                    
                    // if the category is not already in the counts, add it
                    } else {
                        newItemCount.push(cat)
                    }
                    return newItemCount
                }, newItemCount)

                // total up the value
                newTotalValue += loc.totalValue
            })

            // set all the totals to state
            setItems(newItemList)
            setFilteredItems(newItemList.filter(item => {
                return item.status === "discard"
            }))
            setItemCount(newItemCount)
            setTotalValue(newTotalValue)
            setFilters({
                startDate: `${new Date().getFullYear()}-01-01`,
                endDate: `${new Date().getFullYear()}-12-31`,
                inspect: false,
                discard: true
            })

        // if the api call has succeeded and one location has been selected
        } else if (response?.length > 0) {

            // filter down to that location only
            const location = response.filter(loc => {
                return loc.facility === view
            })[0]

            // list the items in all of its units
            const items = location.units.reduce((itemList, unit) => {
                itemList.push(...unit.items)
                return itemList
            }, [])
            
            // set its values to state
            setItems(items)
            setFilteredItems(items.filter(item => {
                return item.status === "discard"
            }))
            setTotalValue(location.totalValue)
            setItemCount(location.itemCount)
            setFilters({
                startDate: `${new Date().getFullYear()}-01-01`,
                endDate: `${new Date().getFullYear()}-12-31`,
                inspect: false,
                discard: true
            })
        }

    // do this whole process when the api call completes and when the view changes
    }, [ response, view ])

    // table rows for the upper table: list of categories and number of items in each
    const displayCategories = itemCount.sort((a, b) => {
        return a.count < b.count
    }).map(item => {
        return (
            <tr key={ item.id } >
                <td className="col-icon">
                    <img className="small-icon" src={ `/img/${ item.icon.src }` } alt={ `${ item.icon.name } icon` } />
                </td>
                <td>{ item.name }</td>
                <td className="col-right">{ item.count }</td>
                <td><Button text="Details" linkTo={ `/category/${ item.id }` } type="small" /></td>
            </tr>
        )
    })

    // list of all items fetched, initially filtered to display items to be discarded within the current calendar year

    // possible filter criteria
    const [ unsaved, setUnsaved ] = useState(false)
    const [ filters, setFilters ] = useState({
        startDate: `${new Date().getFullYear()}-01-01`,
        endDate: `${new Date().getFullYear()}-12-31`,
        inspect: false,
        discard: true
    })

    // handlers for filter checkboxes
    const inspectHandler = () => {
        const newFilters = {...filters}
        newFilters.inspect = filters.inspect ? false : true
        setFilters(newFilters)
    }
    const discardHandler = () => {
        const newFilters = {...filters}
        newFilters.discard = filters.discard ? false : true
        setFilters(newFilters)
    }

    // when filters are updated, update the items listed
    useEffect(() => {
        const newFilters = items?.filter(item => {
            return (
                new Date(item.eol).getTime() > new Date(filters.startDate).getTime() &&
                new Date(item.eol).getTime() < new Date(filters.endDate).getTime() &&
                (filters.discard ? item.status === "discard" : true) &&
                (filters.inspect ? item.status === "inspect" || item.status === "discard" : true)
            )
        }).sort((a, b) => {
            return new Date(a.eol).getTime() > new Date(b.eol).getTime()
        }).sort((a, b) => {
            return +(a.status === "discard") < +(b.status === "discard")
        })
        setFilteredItems(newFilters)
    }, [ items, filters ])

    // render the filtered items as table rows for the lower table
    const displayItems = filteredItems.map(item => {
        return (
            <tr key={ item.id } >
                <td>{ item.name }</td>
                <td>{ capitalize(item.template.name) }</td>
                <td><Button text="Details" linkTo={ `/item/${ item.id }` } type="small" /></td>
                <td>{ adminDate(item.eol) }</td>
            </tr>
        )
    })

    // open state of the dropdown menu (mouse)
    const [ open, setOpen ] = useState(false)
    const toggle = () => {
        const newOpen = open ? false : true
        setOpen(newOpen)
    }

    // open state of the dropdown menu (keyboard)
    const keyboardMenuHandler = (event) => {
        if (event.code === "Enter" || event.code === "Space") {
            const newOpen = open ? false : true
            setOpen(newOpen)
        }
    }

    // when an item is selected by keyboard navigation
    const keyboardItemHandler = (event, item) => {
        if (event.code === "Enter" || event.code === "Space") {
            navigate(`/restore/${ item }`)
        }
    }

    // when keyboard focus leaves the dropdown menu, close it
    const keyboardBlurHandler = (event) => {
        if (event.target.parentElement.lastChild === event.target) {
            setOpen(false)
        }
    }

    // list of entity types that can be restored after deleting
    const list = [ "items", "units", "locations", "categories"]

    // render the list, including all listeners
    const dropdownList = list.map((item, index) => {
        return <li 
            key={ index } 
            onClick={ () => { navigate(`/restore/${ item }`) } } 
            tabIndex= { 0 }
            onKeyUp={ (e) => { keyboardItemHandler(e, item) } }
            onBlur={ (e) => keyboardBlurHandler(e) }
            className="dropdown-item" 
        >Deleted { capitalize(item) }</li>
    })

    // functionality to allow the user to download CSV reports from the database
    // https://stackoverflow.com/questions/53504924/reactjs-download-csv-file-on-button-click
    
    // the download button is invisible, but needs to be clicked programmatically
    // assigning it a useRef allows us to do that
    const downloadLink = useRef()

    // the state of what is downloaded, initialized to falsey values
    const [ csvData, setCsvData ] = useState([])
    const [ reportTitle, setReportTitle ] = useState("")

    const downloadCSV = async(report) => {

        // get which report is to be downloaded from the button label
        setReportTitle(report)

        // if the view is set to a specific location, get the id of that location
        let id = null
        if (view !== "All Locations" && response?.length > 0) {
            id = response.filter(loc => {
                return loc.facility === view
            })[0].id
        }

        // parameters for the api to find our data
        const params = {
            facility: id,
            startDate: filters.startDate,
            endDate: filters.endDate
        }

        // call the api
        apiService.csvReport(report, params, (data) => {
            if (data.error) {
                setErr(data.error)
                return
            }
            setCsvData(data)

            // wait for the state to be updated before calling the download button
            setTimeout(() => {
                downloadLink.current.link.click()
                setStatus({
                    message: `The ${ report } report for ${ view } has been downloaded to your computer.`,
                    error: false
                })
            }, 500)
        })
    }

    // date formatting function for the filename of CSV exports
    const getDate = () => {
        const date = new Date()
        return `${ date.getFullYear() }-${ date.getMonth().toString().padStart(2, "0") }-${ date.getDate().toString().padStart(2, "0") }`
    }

    // https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Admin Dashboard</h2>
                </div>
            </div>
            <div className="row title-row mt-3 mb-2">
                <div className="col-3 d-flex justify-content-end">
                    <Button text="Settings" linkTo="/admin/settings" type="admin" />
                </div>
                <div className="col-3 d-flex justify-content-end">
                    <Button text="Categories" linkTo="/categories" type="admin" />
                </div>
                <div className="col-3 d-flex justify-content-end">
                    <Button text="Users" linkTo="/users" type="admin" />
                </div>
                <div className="col-3 d-flex justify-content-end">
                    <div className="dropdown">
                        <div 
                            className="btn btn-outline-primary dropdown-toggle" 
                            onClick={ toggle } 
                            onKeyUp={ keyboardMenuHandler } 
                            tabIndex={ 0 }
                        >Restore Deleted</div>
                        { open && (
                            <ul className="dropdown-menu" id="restore">
                                { dropdownList }
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            <div className="page-content" id="dashboard">
                <Statusbar />
                <div className="row">
                    <div className="col-4">
                        <h4>Overview</h4>
                        <div className="row row-info">
                            <div className="col col-info">
                                <div className="col-head">
                                    Location
                                </div>
                                <div className="col-content">
                                    <Dropdown 
                                        list={ viewOptions } 
                                        current={ view } 
                                        setCurrent={ setView }
                                    />
                                </div>
                                <div className="col-head">
                                    Total Value
                                </div>
                                <div className="col-content">
                                    $ { totalValue.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
                                </div>
                                <div className="col-head">
                                    CSV Exports
                                    <CSVLink
                                        data={ csvData }
                                        filename={ `${ getDate() } ${ view } ${ reportTitle }.csv` }
                                        className="hidden"
                                        ref={ downloadLink }
                                        target="_blank"
                                    />
                                </div>
                                <div className="col-content">
                                    <Button text="Financial Report" linkTo={ () => downloadCSV("financial") } type="report" />
                                </div>
                                <div className="col-content">
                                    <Button text="Inventory Report" linkTo={ () => downloadCSV("inventory") } type="report" />
                                </div>
                                <div className="col-content">
                                    <Button text="End of Life Report" linkTo={ () => downloadCSV("eol") } type="report" />
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
                <h4>Items Overview</h4>
                <div className="row row-info" id="eol-filters">
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
                            <Checkbox 
                                id="inspect"
                                name="Inspect Filter"
                                checked={ filters.inspect }
                                changeHandler={ inspectHandler }
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Items to Discard Only
                        </div>
                        <div className="col-content">
                            <Checkbox 
                                id="discard"
                                name="Discard Filter"
                                checked={ filters.discard }
                                changeHandler={ discardHandler }
                            />
                        </div>
                    </div>
                </div>
                <Search data={ filteredItems } setData={ setFilteredItems } />
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
                        { displayItems && displayItems.length > 0 ? displayItems : <tr><td colSpan={ 4 }>No items yet.</td></tr> }
                    </tbody>
                </table>
            </div>
        </main>
    )
}

export default Dashboard