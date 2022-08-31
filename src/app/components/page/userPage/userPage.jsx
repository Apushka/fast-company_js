import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../../../api";
import { useHistory } from "react-router-dom";
import Qualities from "../../ui/qualities";
import Loader from "../../common/loader";

const UserPage = ({ userId }) => {
    const [user, setUser] = useState();
    const history = useHistory();

    useEffect(() => {
        api.users.getById(userId).then((user) => setUser(user));
    }, []);

    const handleChange = () => {
        history.push(`/users/${userId}/edit`);
    };

    if (!user) return <Loader />;

    return (
        <>
            <h1>{user.name}</h1>
            <h3>Профессия: {user.profession.name}</h3>
            <Qualities qualities={user.qualities} />
            <p>CompletedMeetings: {user.completedMeetings}</p>
            <h2>Rate: {user.rate}</h2>
            <button onClick={handleChange}>Изменить</button>
        </>
    );
};

UserPage.propTypes = {
    userId: PropTypes.string.isRequired
};

export default UserPage;
