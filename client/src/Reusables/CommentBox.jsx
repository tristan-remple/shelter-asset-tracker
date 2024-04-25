// external dependencies
import { useState } from 'react'

// components
import Comment from '../Reusables/Comment'

//------ MODULE INFO
// ** Available for SCSS **
// This module displays comments about any given item, unit, or location.
// It always displays the most recent comment, and allows the user to toggle visibility of the older comments.
// It takes an array of comment objects.
// Imported by: ItemDetails

const CommentBox = ({ comments }) => {

    if (!comments || comments.length == 0) {
        return (
            <div className="comment-box">
                <strong>Comments:</strong><br />
                No comments yet
            </div>
        )
    }

    // order the comments by date
    comments.sort((a, b) => (new Date(b.commentDate) - new Date(a.commentDate) ))

    // grab the most recent comment and format it for display
    const latestComment = comments[0]
    const displayComment = <Comment key={ latestComment.commentId } comment={ latestComment } />

    // format all the comments for display
    const displayOlderComments = comments.map(cmt => {
        return <Comment key={ cmt.commentId } comment={ cmt } />
    })

    // remove the most recent from the second array
    displayOlderComments.shift()

    // if there are no comments older than the most recent one, don't display the toggle
    const readMore = displayOlderComments.length > 0

    // create toggle functionality for older comments
    const [ olderComments, setOlderComments ] = useState(false)
    const toggleOlderComments = () => {
        const newDisplay = olderComments ? false : true
        setOlderComments(newDisplay)
    }

    const keyboardHandler = (event) => {
        if (event.code === "Enter" || event.code === "Space") {
            toggleOlderComments()
        }
    }

    return (
        <div className="comment-box">
            <strong>Comments:</strong><br />
            { displayComment }
            { olderComments && displayOlderComments }
            { readMore && <div className="comment-toggle" onClick={ toggleOlderComments } onKeyUp={ keyboardHandler }>
                { olderComments ? "Hide" : "Show" } older comments
            </div> }
        </div>
    )
}

export default CommentBox