import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import userService from "../services/user.service";
import { useAuth } from "./useAuth";

const UserContext = React.createContext();

export const useUser = () => {
    return useContext(UserContext);
};

const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        setUsers(users.map(u => {
            return u._id === currentUser._id ? currentUser : u;
        }));
    }, [currentUser]);

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        if (error !== null) {
            toast.error(error);
            setError(null);
        }
    }, [error]);

    const getUsers = async () => {
        try {
            const { content } = await userService.get();
            setUsers(content);
            setIsLoading(false);
        } catch (error) {
            errorCatcher(error);
        }
    };

    const getUserById = (userId) => {
        return users.find((u) => u._id === userId);
    };

    const errorCatcher = (error) => {
        const { message } = error.response.data;
        setError(message);
    };

    return <UserContext.Provider value={{ users, getUserById, setUsers }}>
        {!isLoading ? children : "Loading..."}
    </UserContext.Provider>;
};

UserProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default UserProvider;
