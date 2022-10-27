import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import commentService from "../services/comment.service";
import { useSelector } from "react-redux";
import { getCurrentUserId } from "../store/users";

const CommentsContext = React.createContext();

export const useComments = () => {
    return useContext(CommentsContext);
};

export const CommentsProvider = ({ children }) => {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const currentUserId = useSelector(getCurrentUserId());
    const { userId } = useParams();

    useEffect(() => {
        getComments();
    }, [userId]);

    useEffect(() => {
        if (error !== null) {
            toast.error(error);
            setError(null);
        }
    }, [error]);

    const getComments = async () => {
        try {
            const { content } = await commentService.getComments(userId);
            setComments(content);
        } catch (error) {
            errorCatcher(error);
        } finally {
            setIsLoading(false);
        }
    };

    const createComment = async (data) => {
        const comment = {
            ...data,
            _id: nanoid(),
            userId: currentUserId,
            pageId: userId,
            created_at: Date.now()
        };
        try {
            const { content } = await commentService.createComment(comment);
            setComments(prevState => [...prevState, content]);
        } catch (error) {
            errorCatcher(error);
        }
    };

    const removeComment = async (id) => {
        try {
            const { content } = await commentService.removeComment(id);
            if (content === null) {
                setComments(prevState => prevState.filter((c) => c._id !== id));
            }
        } catch (error) {
            errorCatcher(error);
        }
    };

    const errorCatcher = (error) => {
        const { message } = error.response.data;
        setError(message);
    };
    return <CommentsContext.Provider value={{ comments, createComment, isLoading, removeComment }}>
        {children}
    </CommentsContext.Provider>;
};

CommentsProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};
