//------ MODULE INFO
// This helper function takes an all-lowercase string and capitalizes it like a title.
// Imported by: ItemDetails

function capitalize(str) {

    // check if it's blank (loose equality intentional)
    if (str == "") {
        return "";
    }

    // split string into words, initialize new string
    let wordArr = str.split(" ");
    let newStr = "";

    // for each word in the string
    for (let i = 0; i < wordArr.length; i++) {

        // capitalize the first letter
        let firstLetter = wordArr[i][0].toUpperCase();

        // assign the rest of the word to a different variable
        let rest = wordArr[i].slice(1);

        // combine them again and add them to the new string
        let word = firstLetter + rest;
        newStr += word + " ";
    }

    // remove trailing space from the string and return it
    newStr = newStr.slice(0, newStr.length - 1);
    return newStr;
}

export default capitalize;