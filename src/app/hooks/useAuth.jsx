import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axios from "axios";
import userService from "../services/user.service";
import { setTokens } from "../services/localStorage.service";

const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const httpAuth = axios.create();

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        if (error !== null) {
            toast.error(error);
            setError(null);
        }
    }, [error]);

    const errorCatcher = (error) => {
        const { message } = error.response.data;
        setError(message);
    };

    const signUp = async ({ email, password, ...rest }) => {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_KEY}`;
        try {
            const { data } = await httpAuth.post(url, { email, password, returnSecureToken: true });
            setTokens(data);
            await createUser({ _id: data.localId, email, ...rest });
        } catch (error) {
            errorCatcher(error);
            const { code, message } = error.response.data.error;
            if (code === 400) {
                if (message === "EMAIL_EXISTS") {
                    const errorObject = { email: "Пользователь с таким email уже существует" };
                    throw errorObject;
                }
            }
        }
    };

    const signIn = async ({ email, password }) => {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_KEY}`;
        try {
            const { data } = await httpAuth.post(url, { email, password, returnSecureToken: true });
            setTokens(data);
            await getUser(data.localId);
        } catch (error) {
            errorCatcher(error);
            const { code, message } = error.response.data.error;
            if (code === 400) {
                // firebase возвращает, где именно было введено неверное значение, но по правилам нельзя указывать, что
                // введено неправильно - email или пароль. Нужно выдать обобщенную информацию, что что-то введено неверно.
                if (message === "EMAIL_NOT_FOUND" || message === "INVALID_PASSWORD") {
                    const errorObject = { email: "Неверный email", password: "Неверный пароль" };
                    throw errorObject;
                }
            }
        }
    };

    const createUser = async (data) => {
        try {
            const { content } = await userService.create(data);
            setCurrentUser(content);
        } catch (error) {
            errorCatcher(error);
        }
    };

    const getUser = async (id) => {
        try {
            const { content } = await userService.getById(id);
            setCurrentUser(content);
        } catch (error) {
            errorCatcher(error);
        }
    };

    return <AuthContext.Provider value={{ signUp, signIn, currentUser }} >
        {children}
    </AuthContext.Provider >;
};

AuthProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default AuthProvider;
