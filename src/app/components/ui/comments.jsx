import _ from "lodash";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { CommentsList } from "../common/comments";
import CommentAddForm from "./commentAddForm";

const Comments = () => {
    const [comments, setComments] = useState([]);
    const { userId } = useParams();

    useEffect(() => {
        api.comments.fetchCommentsForUser(userId).then(comments => setComments(comments));
    }, []);

    const handleRemove = (id) => {
        api.comments.remove(id)
            .then(id => setComments(prevState => prevState.filter(comment => comment._id !== id)));
    };

    const handleSubmit = (data) => {
        api.comments.add({ ...data, pageId: userId })
            .then(comment => setComments(prevState => ([...prevState, comment])));
    };

    const sortedComments = _.orderBy(comments, ["created_at"], ["desc"]);

    return (
        <>
            <div className="card mb-2">
                {" "}
                <div className="card-body ">
                    <CommentAddForm onSubmit={handleSubmit} />
                </div>
            </div>
            {sortedComments.length > 0 && <div className="card mb-3">
                <div className="card-body ">
                    <h2>Comments</h2>
                    <hr />
                    <CommentsList
                        comments={sortedComments}
                        onRemove={handleRemove} />
                </div>
            </div>}
        </>
    );
};

export default Comments;
