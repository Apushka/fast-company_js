import React from "react";
import { useSelector } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import UserEditPage from "../components/page/userEditPage/userEditPage";
import UserPage from "../components/page/userPage";
import UsersListPage from "../components/page/usersListPage";
import UsersLoader from "../hoc/usersLoader";
import { getCurrentUserId } from "../store/users";

const Users = () => {
    const { userId, edit } = useParams();
    const currentUserId = useSelector(getCurrentUserId());

    return <UsersLoader>
        {userId
            ? edit ? userId === currentUserId ? <UserEditPage /> : <Redirect to={`/users/${currentUserId}/edit`} /> : <UserPage userId={userId} />
            : <UsersListPage />}
    </UsersLoader>;
};

export default Users;
