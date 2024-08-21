// external dependencies
import { useState, useEffect } from "react"

//------ MODULE INFO
// ** Available for SCSS **
// This module creates an autofill input for use with forms.
// It takes the same parameters as Dropdown, but the user input allows faster filtering.
// list is a list of items to appear in the dropdown
// current is a state variable that is one of those items, which is currently selected
// setCurrent is the setter for the current state variable
// Imported by: ItemEdit, ItemCreate, UnitEdit, UnitCreate

const Autofill = ({ list, current, setCurrent }) => {

    const id = `dropdown-${ list[0] }`

    // open state of the dropdown menu
    const [ open, setOpen ] = useState(false)

    const [ userInput, setUserInput ] = useState(current)

    useEffect(() => {
        setUserInput(current)
    }, [ current ])

    const [ filteredList, setFilteredList ] = useState(list)
    const handleChange = (e) => {
        const newUserInput = e.target.value
        const newFilteredList = list.filter(item => {
            return item.toLowerCase().includes(newUserInput.toLowerCase())
        })
        if (newFilteredList.length === 1 && newFilteredList[0].toLowerCase() === newUserInput.toLowerCase()) {
            setCurrent(newFilteredList[0])
            setOpen(false)
        } else {
            setOpen(true)
        }
        setUserInput(newUserInput)
        setFilteredList(newFilteredList)
    }

    const kbInputChange = (event) => {
        if (event.code === "ArrowDown") {
            setOpen(true)
            event.preventDefault()
            document.getElementById(id)?.firstChild?.focus()
        }
    }

    // when an item is selected by keyboard navigation
    const kbItemHandler = (event, item) => {
        if (event.code === "Enter" || event.code === "Space") {
            setOpen(false)
            setUserInput(item)
            setCurrent(item)
        } else if (event.code === "ArrowDown") {
            event.preventDefault()
            event.target.nextSibling?.focus()
        } else if (event.code === "ArrowUp") {
            event.preventDefault()
            event.target.previousSibling ? event.target.previousSibling.focus() : document.getElementById(`${ id }-input`).focus()
        }
    }

    // when keyboard focus leaves the dropdown menu, close it
    const kbBlurHandler = (event) => {
        if (event.target.parentElement.lastChild === event.target) {
            setOpen(false)
        }
    }

    const focusEmptyInput = () => {
        if (!userInput) {
            setOpen(true)
        }
    }

    // render the list, including all listeners
    const renderedList = filteredList.length > 0 ? filteredList.map((item, index) => {
        return <li 
            key={ index } 
            onMouseDown={ () => { setCurrent(item); setUserInput(item); setOpen(false) } } 
            tabIndex= { 0 }
            onKeyDown={ (e) => { kbItemHandler(e, item) } }
            onBlur={ (e) => kbBlurHandler(e) }
            className="dropdown-item" 
        >{ item }</li>
    }) : <li className="danger" >No matches</li>

    return (
        <div className="dropdown">
            <input 
                id={ `${ id }-input` }
                onChange={ handleChange }
                tabIndex={ 0 }
                value={ userInput }
                onKeyDown={ kbInputChange }
                onFocus={ focusEmptyInput }
                onBlur={ () => { setCurrent(userInput) } }
                type="text"
            />
            { open && (
                <ul className="dropdown-menu" id={ id }>
                    { renderedList }
                </ul>
            )}
        </div>
    )
}

export default Autofill