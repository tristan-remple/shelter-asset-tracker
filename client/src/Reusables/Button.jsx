// external dependencies
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'


//------ MODULE INFO
// ** Available for SCSS **
// This module defines all buttons.
// It exists to quickly update the styling of multiple types of button.
// Imported by: ChangePanel, ItemDetails, Error, Dropdown, ItemEdit, ItemCreate, UnitDetails

const Button = ({ text, linkTo, type, className}) => {

    // apply styling classes depending on type
    // feel free to change these classes
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
        case "dropdown":
            buttonClass += "btn-outline-primary dropdown-toggle"
            break
        case "small":
            buttonClass += "btn-small btn-secondary"
            break
        default:
            buttonClass += "btn-secondary"
            break
    }

    if (typeof linkTo === "function") {
        return <div className={ buttonClass } onClick={ linkTo } >{ text }</div>
    } else if (linkTo === null) {
        return <div className={ buttonClass } >{ text }</div>
    } else if (linkTo.includes("#")) {
        return <HashLink to={ linkTo } className={ buttonClass }>{ text }</HashLink>
    } else {
        return <Link to={ linkTo } className={ buttonClass }>{ text }</Link>
    }
    
}

export default Button