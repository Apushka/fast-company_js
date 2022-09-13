/* eslint-disable camelcase */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../../../api";
import Loader from "../loader";
import { displayDate } from "../../../utils/displayDate";

const Comment = ({ _id, created_at, content, userId, onRemove }) => {
    const [userName, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        api.users.getById(userId)
            .then(user => setUserName(user.name))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <Loader />;

    return (<div className="bg-light card-body  mb-3" key={_id}>
        <div className="row">
            <div className="col">
                <div className="d-flex flex-start ">
                    <img
                        src={`https://avatars.dicebear.com/api/avataaars/${(
                            Math.random() + 1
                        )
                            .toString(36)
                            .substring(7)}.svg`}
                        className="rounded-circle shadow-1-strong me-3"
                        alt="avatar"
                        width="65"
                        height="65"
                    />
                    <div className="flex-grow-1 flex-shrink-1">
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="mb-1 ">
                                    {userName}
                                    <span className="small px-1">
                                        - {displayDate(created_at)}
                                    </span>
                                </p>
                                <button className="btn btn-sm text-primary d-flex align-items-center"
                                    onClick={() => onRemove(_id)}>
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <p className="small mb-0">{content}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div >);
};

Comment.propTypes = {
    _id: PropTypes.string,
    created_at: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    content: PropTypes.string,
    userId: PropTypes.string,
    onRemove: PropTypes.func
};

export default Comment;
