// external dependencies
import { useState } from 'react'

// components
import Comment from './Comment'

//------ MODULE INFO
// This module displays comments about any given item.
// It always displays the most recent comment, and allows the user to toggle visibility of the older comments.
// It takes an array of comment objects.
// Imported by: ItemDetails

const CommentBox = ({ comments, setPreview }) => {

    if (!comments || comments.length == 0) {
        return (
            <div className="comment-box">
                <strong>Comments:</strong><br />
                No comments yet
            </div>
        )
    }

    // order the comments by date
    comments.sort((a, b) => { return new Date(b.createdAt) - new Date(a.createdAt) })

    // grab the most recent comment and format it for display
    const latestComment = comments[0]
    const displayComment = <Comment key={ latestComment.commentId } comment={ latestComment } setPreview={ setPreview } />

    // format all the comments for display
    const displayOlderComments = comments.map(cmt => {
        return <Comment key={ cmt.id.id } comment={ cmt } setPreview={ setPreview } />
    })

    // remove the most recent from the second array
    displayOlderComments.shift()

    // if there are no comments older than the most recent one, don't display the toggle
    const readMore = displayOlderComments.length > 0

    const attachmentComments = comments.filter(cmt => cmt.attachments.length > 0)

    const displayCommentsWithAttachments = attachmentComments.map(cmt => {
        return <Comment key={ cmt.id.id } comment={ cmt } setPreview={ setPreview } />
    })

    // create toggle functionality
    const [ olderComments, setOlderComments ] = useState(false)
    const toggleOlderComments = () => {
        const newDisplay = olderComments ? false : true
        setOlderComments(newDisplay)
    }

    const [ showAttachments, setShowAttachments ] = useState(false)
    const toggleAttachments = () => {
        const newAttachments = showAttachments ? false : true
        if (newAttachments === true) {
            setOlderComments(false)
        }
        setShowAttachments(newAttachments)
    }

    const keyboardHandler = (event) => {
        if (event.code === "Enter" || event.code === "Space") {
            toggleOlderComments()
        }
    }

    const keyboardAttachments = (event) => {
        if (event.code === "Enter" || event.code === "Space") {
            toggleAttachments()
        }
    }

    return (
        <div className="comment-box">
            <strong>Comments:</strong><br />
            { !showAttachments && displayComment }
            { showAttachments ? displayCommentsWithAttachments : olderComments ? displayOlderComments : "" }
            { readMore && <div className="btn btn-small btn-secondary" onClick={ toggleOlderComments } onKeyUp={ keyboardHandler }>
                { olderComments ? "Hide" : "Show" } older comments
            </div> }
            { attachmentComments.length > 0 && <div className="btn btn-small btn-secondary" onClick={ toggleAttachments } onKeyUp={ keyboardAttachments }>
                { showAttachments ? "Hide" : "Show all" } attachments
            </div> }
        </div>
    )
}

export default CommentBox