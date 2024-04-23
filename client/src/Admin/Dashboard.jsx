// external dependencies
import { useParams } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"

// components
import Button from "../Reusables/Button"

//------ MODULE INFO
// Displays some stats and reports for the admin.
// Also has some useful admin links.
// Imported by: App

const Dashboard = () => {

    // get context information
    const { id } = useParams()
    const { status } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")
    
    let urlId = id
    // fetch unit data from the api
    const [ response, setResponse ] = useState()
    const [ filteredUnits, setFilteredUnits ] = useState([])
    useEffect(() => {
        (async()=>{
            await apiService.singleLocation(urlId, function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setResponse(data)
                    setFilteredUnits(data.units)
                    setErr(null)
                }
            })
        })()
    }, [])

    return (
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
                <div className="row row-info"><p className="my-2">Reports to go here.</p></div>
            </div>
        </main>
    )
}

export default Dashboard