// external dependencies
import { useState } from "react"

//------ MODULE INFO
// This module is a search bar used to filter results that display on a page.
// It takes in the data and setData state variables defined by the component importing it.
// The data variable should be the full original data.
// The setData function should alter the state of a COPY of the data.
// In the importing components, the function that displays data should map the COPY of the data changed by setData.
// Imported by: LocationDetails

const Search = ({ data, setData }) => {

    // set up controlled input
    const [ searchTerm, setSearchTerm ] = useState("")
    const changeHandler = (event) => {
        const input = event.target.value
        setSearchTerm(input)
    }

    // function that recursively checks an object for a value
    const iterate = (obj, term) => {
        let returnVal = false;
        returnVal = Object.keys(obj).some(key => {
            if (typeof obj[key] === 'string' && obj[key].toLowerCase().includes(term.toLowerCase())) {
                returnVal = true;
                return true;
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                // recursive function
                return iterate(obj[key], term);
            }
        });
        return returnVal;
    }

    // function that applies the recursive function as a filter on an array of data
    const applyFilter = () => {
    
        // if the term is empty, show all
        if (searchTerm == "") {
            setData(data);
        } else {
    
            // otherwise, filter the data by the term
            const newFilter = data.filter(item => {
                return iterate(item, searchTerm);
            });
            setData(newFilter)
        }
    }

    return (
        <div id="search" className="d-flex row-info" role="search">
            <input
                className="form-control m-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={ searchTerm }
                onChange={ changeHandler }
            />
            <button
                className="btn btn-secondary search-submit"
                type="submit"
                onClick={ applyFilter }
            >
                Search
            </button>
        </div>
    )
}

export default Search