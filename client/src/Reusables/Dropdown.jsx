// external dependencies
import { useState } from "react"

// components
import Button from "./Button"

//------ MODULE INFO
// ** Available for SCSS **
// This module creates a dropdown for use with forms.
// list is a list of items to appear in the dropdown
// current is a state variable that is one of those items, which is currently selected
// setCurrent is the setter for the current state variable
// Imported by: ItemEdit, ItemCreate

const Dropdown = ({ list, current, setCurrent }) => {

    const [ open, setOpen ] = useState(false)
    const toggle = () => {
        const newOpen = open ? false : true
        setOpen(newOpen)
    }

    const renderedList = list.map((item, index) => {
        return <li key={ index } onClick={ () => { toggle(); setCurrent(item) } } className="dropdown-item" >{ item }</li>
    })

    return (
        <div className="dropdown">
            <Button text={ current } linkTo={ toggle } type="dropdown" />
            { open && (
                <ul className="dropdown-menu">
                    { renderedList }
                </ul>
            )}
        </div>
    )
}

export default Dropdown