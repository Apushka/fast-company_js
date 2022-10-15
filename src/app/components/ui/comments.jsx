import _ from "lodash";
import React from "react";
import { useComments } from "../../hooks/useComments";
import { CommentsList } from "../common/comments";
import CommentAddForm from "./commentAddForm";

const Comments = () => {
    const { createComment, comments, removeComment } = useComments();

    const handleRemove = (id) => {
        removeComment(id);
    };

    const handleSubmit = (data) => {
        createComment(data);
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
