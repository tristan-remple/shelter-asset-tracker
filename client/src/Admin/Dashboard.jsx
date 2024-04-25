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
import Dropdown from '../Reusables/Dropdown'

//------ MODULE INFO
// Displays some stats and reports for the admin.
// Also has some useful admin links.
// Imported by: App

const Dashboard = () => {

    // get context information
    const { status } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")

    // view options: list of location names to filter by dropdown
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
    const [ discardItems, setDiscardItems ] = useState([])
    const [ filteredItems, setFilteredItems ] = useState([])
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
                                    count: newCat.count + cat.count
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
            setDiscardItems(newItemList)
            setFilteredItems(newItemList.filter(item => {
                return item.toDiscard
            }))
            setItemCount(newItemCount)
            setTotalValue(newTotalValue)

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
            setDiscardItems(items)
            setFilteredItems(items)
            setTotalValue(location.totalValue)
            setItemCount(location.itemCount)
        }

    // do this whole process when the api call completes and when the view changes
    }, [ response, view ])

    // table rows for the upper table: list of categories and number of items in each
    const displayCategories = itemCount.sort((a, b) => {
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

    // possible filter criteria
    const [ unsaved, setUnsaved ] = useState(false)
    const [ filters, setFilters ] = useState({
        startDate: `${new Date().getFullYear()}-01-01`,
        endDate: `${new Date().getFullYear()}-12-31`,
        inspect: false,
        discard: true
    })

    // --CHANGES NEEDED HERE
    // when filters are updated, update the items listed
    useEffect(() => {
        const newFilters = discardItems.filter(item => { // discardItems -> filterItems when EoL is figured out
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
    const displayItems = discardItems.map(item => {
        return (
            <tr key={ item.id } >
                <td>{ item.name }</td>
                <td>{ capitalize(item.template) }</td>
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