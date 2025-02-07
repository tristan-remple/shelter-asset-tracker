// external dependencies
import { useContext } from 'react';
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import { statusContext } from '../Services/Context';

//------ MODULE INFO
// This module renders a button for navigation or actions.
// When clicked, a button rendered using this module will wipe the status message.

const Button = ({ text, linkTo, type, id, download }) => {

    let buttonClass = "btn ";
    switch (type) {
        case "action":
            buttonClass += "btn-primary"
            break
        case "nav":
            buttonClass += "btn-secondary"
            break
        case "admin":
            buttonClass += "btn-admin"
            break
        case "danger":
            buttonClass += "btn-danger"
            break
        case "error":
            buttonClass += "error"
            break
        case "dropdown":
            buttonClass += "btn-outline-primary dropdown-toggle"
            break
        case "small":
            buttonClass += "btn-small btn-secondary"
            break
        case "report": 
            buttonClass += "btn-small btn-secondary btn-report"
            break
        case "sort":
            buttonClass += "btn-sort btn-secondary"
            break
        default:
            buttonClass += "btn-secondary"
            break
    }

    const { setStatus } = useContext(statusContext)

    const clearStatus = () => {
        setStatus({
            message: "",
            error: false
        })
    }

    const keyboardHandler = (event) => {
        if (event.code === "Enter" || event.code === "Space") {
            linkTo()
        }
    }

    const trap = (event) => {
        if (text === "Close Selector" && event.code === "Tab" && event.shiftKey === false) {
            event.preventDefault()
        }
    }

    if (typeof linkTo === "function") {
        return <div className={ buttonClass } onClick={ linkTo } onKeyUp={ keyboardHandler } id={ id } tabIndex={ 0 } onKeyDown={ trap } >{ text }</div>
    } else if (linkTo === null) {
        return <div className={ buttonClass } id={ id }>{ text }</div>
    } else if (linkTo.includes("#")) {
        return <HashLink to={ linkTo } className={ buttonClass } id={ id } tabIndex={ 0 } onClick={ clearStatus }>{ text }</HashLink>
    } else if (download) {
        return <Link to={ linkTo } className={ buttonClass } id={ id } tabIndex={ 0 } target="_blank" download>{ text }</Link>
    } else {
        return <Link to={ linkTo } className={ buttonClass } id={ id } tabIndex={ 0 } onClick={ clearStatus }>{ text }</Link>
    }
}

export default Button
