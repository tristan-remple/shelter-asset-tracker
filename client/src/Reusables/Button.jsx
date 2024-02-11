// external dependencies
import { Link } from 'react-router-dom'

//------ MODULE INFO
// This module defines all buttons.
// It exists to quickly update the styling of multiple types of button.
// Imported by: 

const Button = ({ text, linkTo, type }) => {

    // apply styling classes depending on type
    let buttonClass = "btn "
    switch (type) {
        case "action":
            buttonClass += "btn-primary"
            break;
        case "nav":
            buttonClass += "btn-secondary"
            break;
        case "admin":
            buttonClass += "btn-info"
            break;
        case "danger":
            buttonClass += "btn-danger"
            break;
        default:
            buttonClass += "btn-secondary"
            break;
    }

    if (typeof linkTo === "function") {
        return <div className={ buttonClass } onClick={ linkTo } >{ text }</div>
    } else if (linkTo === null) {
        return <div className={ buttonClass } >{ text }</div>
    } else {
        return <Link to={ linkTo } className={ buttonClass }>{ text }</Link>
    }
    
}

export default Button