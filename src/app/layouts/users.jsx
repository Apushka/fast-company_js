import React from "react";
import { useParams } from "react-router-dom";
import UserEditPage from "../components/page/userEditPage/userEditPage";
import UserPage from "../components/page/userPage";
import UsersListPage from "../components/page/usersListPage";
import UserProvider from "../hooks/useUser";

const Users = () => {
    const { userId, edit } = useParams();

    return <>
        <UserProvider>
            {userId
                ? edit ? <UserEditPage /> : <UserPage userId={userId} />
                : <UsersListPage />}
        </UserProvider>
    </>;
};

export default Users;
