// Button.jsx
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'

const Button = ({ text, linkTo, type, className, id }) => {

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
        return <div className={ buttonClass } onClick={ linkTo } id={id}>{ text }</div>
    } else if (linkTo === null) {
        return <div className={ buttonClass } id={id}>{ text }</div>
    } else if (linkTo.includes("#")) {
        return <HashLink to={ linkTo } className={ buttonClass } id={id}>{ text }</HashLink>
    } else {
        return <Link to={ linkTo } className={ buttonClass } id={id}>{ text }</Link>
    }
}

export default Button
