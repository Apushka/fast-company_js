import React from "react";
import { Redirect, useParams } from "react-router-dom";
import UserEditPage from "../components/page/userEditPage/userEditPage";
import UserPage from "../components/page/userPage";
import UsersListPage from "../components/page/usersListPage";
import UserProvider from "../hooks/useUser";
import { useAuth } from "../hooks/useAuth";

const Users = () => {
    const { userId, edit } = useParams();
    const { currentUser } = useAuth();

    return <>
        <UserProvider>
            {userId
                ? edit ? userId === currentUser._id ? <UserEditPage /> : <Redirect to={`/users/${currentUser._id}/edit`} /> : <UserPage userId={userId} />
                : <UsersListPage />}
        </UserProvider>
    </>;
};

export default Users;
