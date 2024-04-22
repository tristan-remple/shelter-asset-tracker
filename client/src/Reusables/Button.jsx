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

    const keyboardHandler = (event) => {
        if (event.code === "Enter" || event.code === "Space") {
            linkTo()
        }
    }

    if (typeof linkTo === "function") {
        return <div className={ buttonClass } onClick={ linkTo } onKeyUp={ keyboardHandler } id={ id } tabIndex={ 0 }>{ text }</div>
    } else if (linkTo === null) {
        return <div className={ buttonClass } id={ id }>{ text }</div>
    } else if (linkTo.includes("#")) {
        return <HashLink to={ linkTo } className={ buttonClass } id={ id } tabIndex={ 0 }>{ text }</HashLink>
    } else {
        return <Link to={ linkTo } className={ buttonClass } id={ id } tabIndex={ 0 }>{ text }</Link>
    }
}

export default Button
