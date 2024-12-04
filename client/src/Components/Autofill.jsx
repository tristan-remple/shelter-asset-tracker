// external dependencies
import { useState, useEffect, useRef } from "react"

//------ MODULE INFO
// This module creates an autofill input for use with forms.
// It takes the same parameters as Dropdown, but the user input allows faster filtering.
// list is a list of items to appear in the dropdown
// current is a state variable that is one of those items, which is currently selected
// setCurrent is the setter for the current state variable
// Imported by: ItemEdit, ItemCreate, UnitEdit, UnitCreate

const Autofill = ({ list, current, setCurrent, error }) => {

    const id = `dropdown-${ list[0] }`

    // open state of the dropdown menu
    const [ open, setOpen ] = useState(false)

    const [ className, setClassName ] = useState("")
    const [ userInput, setUserInput ] = useState(current)

    // if the currently selected item changes by any method other than use typing, update the text field
    useEffect(() => {
        setUserInput(current)
    }, [ current ])

    // create new state based on the list so we can manipulate it without changing the original
    const [ filteredList, setFilteredList ] = useState(list)

    // when the user types, filter the autofill suggestions based on their input
    const handleChange = (e) => {
        const newUserInput = e.target.value
        const newFilteredList = list.filter(item => {
            return item.toLowerCase().includes(newUserInput.toLowerCase())
        })
        if (newFilteredList.length === 1 && newFilteredList[0].toLowerCase() === newUserInput.toLowerCase()) {
            setCurrent(newFilteredList[0])
            setClassName("")
            setOpen(false)
        } else if (newFilteredList.length === 0) {
            setClassName("error")
        } else {
            setClassName("")
            setOpen(true)
        }
        setUserInput(newUserInput)
        setFilteredList(newFilteredList)
    }

    // when the user presses the down arrow, focus on the first available suggestion instead of scrolling the page
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

    // make sure the dropdown stays open while the list is being navigated by keyboard
    const focusEmptyInput = () => {
        if (!userInput) {
            setOpen(true)
        }
    }

    // set error class when the element is in error state
    useEffect(() => {
        if (error) {
            setClassName("error")
        } else {
            setClassName("")
        }
    }, [ error ])

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
        <>
            <div className="dropdown" ref={ wrapperRef }>
                <input 
                    id={ `${ id }-input` }
                    onChange={ handleChange }
                    tabIndex={ 0 }
                    value={ userInput }
                    onKeyDown={ kbInputChange }
                    onFocus={ focusEmptyInput }
                    onBlur={ () => { setCurrent(userInput) } }
                    type="text"
                    placeholder="Select:"
                    className={ className }
                />
                { open && (
                    <ul className="dropdown-menu" id={ id }>
                        { renderedList }
                    </ul>
                )}
            </div>
            { error && <div className="row row-info error error-message"><p className="my-2">{ error }</p></div> }
        </>
        
    )
}

export default Autofill