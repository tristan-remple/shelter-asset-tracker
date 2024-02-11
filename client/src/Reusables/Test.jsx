// external dependencies
import { useState, useContext } from "react"

// internal dependencies
import { statusContext } from "../Services/Context"

// components
import Search from "./Search"
import ChangePanel from "./ChangePanel"
import Flag from "./Flag"

//------ MODULE INFO
// This module is for testing components that aren't being used elsewhere yet.
// This component should never appear in the finished app.
// Imported by: App.jsx

const Test = () => {

    // dummy data for testing the search
    const data = [
        {
            name: "Jamie",
            department: "IT"
        },
        {
            name: "Keros",
            department: "IT"
        },
        {
            name: "Kirsten",
            department: "Marketing"
        }
    ]

    // this state is needed for the search
    const [ filteredData, setFilteredData ] = useState(data)

    // for the save panel
    // isSaved defaults to false here
    // but on a real form it would default to true, and be changed to false by the fields' onChange functions
    const [ isSaved, setIsSaved ] = useState(false)

    // this would be a post request to the api in a real form
    const save = () => {
        console.log("Saved!")
        setIsSaved(true)
    }

    // this is only needed if we want the save changes component to be a modal
    const linkOut = "/otherpage"

    // global status message to display updates
    const { status } = useContext(statusContext)
    
    return (
        <>
            <Search data={ data } setData={ setFilteredData } />
            { filteredData.map((item, index) => {
                return <p key={ index } >{ item.name } from { item.department }</p>
            })}
            { // this would have to be formatted differently to account for the initial null status 
            isSaved ? <p>{ status }</p> : <ChangePanel save={ save } linkOut={ linkOut } /> }
            <Flag color="grey" />
        </>
    )
}

export default Test