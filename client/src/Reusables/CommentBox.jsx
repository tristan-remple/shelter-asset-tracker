import { useState } from 'react'

import Comment from '../Reusables/Comment'

//------ MODULE INFO
// This module displays comments about any given item, unit, or location.
// It takes an array of comment objects.
// Imported by: ItemDetails

const CommentBox = ({ comments }) => {

    const latestComment = comments.sort((a, b) => (new Date(b.commentDate) - new Date(a.commentDate) ))[0]
    const displayComment = <Comment key={ latestComment.commentId } comment={ latestComment } />
    const displayOlderComments = comments.map(cmt => {
        return <Comment key={ cmt.commentId } comment={ cmt } />
    })
    displayOlderComments.shift()

    const [ olderComments, setOlderComments ] = useState(false)

    const toggleOlderComments = () => {
        const newDisplay = olderComments ? false : true
        setOlderComments(newDisplay)
    }

    return (
        <div className="comment-box">
            <strong>Comments:</strong><br />
            { displayComment }
            { olderComments && displayOlderComments }
            <div className="comment-toggle" onClick={ toggleOlderComments } >Display older comments</div>
        </div>
    )
}

export default CommentBox