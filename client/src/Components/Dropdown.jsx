// external dependencies
import { useState, useRef, useEffect } from "react"

//------ MODULE INFO
// This module creates a dropdown for use with forms.
// list is a list of items to appear in the dropdown
// current is a state variable that is one of those items, which is currently selected
// setCurrent is the setter for the current state variable
// Imported by: Dashboard

const Dropdown = ({ list, current, setCurrent, error }) => {

    const id = `dropdown-${ list[0] }`

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
            setOpen(false)
            setCurrent(item)
        }
    }

    // when keyboard focus leaves the dropdown menu, close it
    const keyboardBlurHandler = (event) => {
        if (event.target.parentElement.lastChild === event.target) {
            setOpen(false)
        }
    }

    // render the list, including all listeners
    const renderedList = list.map((item, index) => {
        return <li 
            key={ index } 
            onClick={ () => { toggle(); setCurrent(item) } } 
            tabIndex= { 0 }
            onKeyUp={ (e) => { keyboardItemHandler(e, item) } }
            onBlur={ (e) => keyboardBlurHandler(e) }
            className="dropdown-item" 
        >{ item }</li>
    })

    const errorClass = error ? " error" : ""

    // if the user clicks outside the dropdown while it is open, close it
    // https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    const useOutsideFocus = (ref) => {
        useEffect(() => {
            const outsideClickHandler = (e) => {
                if (ref.current && !ref.current.contains(e.target)) {
                    setOpen(false)
                }
            }
            document.addEventListener("click", outsideClickHandler)
            return () => {
                document.removeEventListener("click", outsideClickHandler)
            }
        }, [ ref ])
    }

    const wrapperRef = useRef(null)
    useOutsideFocus(wrapperRef)

    return (
        <div ref={ wrapperRef } className="dropdown" >
            <div 
                className={ `btn btn-outline-primary dropdown-toggle${ errorClass }` }
                onClick={ toggle } 
                onKeyUp={ keyboardMenuHandler } 
                tabIndex={ 0 }
            >{ current ? current : "Select:" }</div>
            { open && (
                <ul className="dropdown-menu" id={ id }>
                    { renderedList }
                </ul>
            )}
            { error && <div className="row row-info error error-message"><p className="my-2">Please select an option from the dropdown.</p></div> }
        </div>
    )
}

export default Dropdown