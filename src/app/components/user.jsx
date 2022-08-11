import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../api";
import Quality from "./quality";
import { useHistory } from "react-router-dom";

const User = ({ userId }) => {
    const [user, setUser] = useState();
    const history = useHistory();

    useEffect(() => {
        api.users.getById(userId).then((user) => setUser(user));
    }, []);

    const handleReturn = () => {
        history.push("/users");
    };

    if (!user) return <h2>Loading...</h2>;

    return (
        <>
            <h1>{user.name}</h1>
            <h3>Профессия: {user.profession.name}</h3>
            {user.qualities.map(({ _id, color, name }) => (
                <Quality
                    key={_id}
                    color={color}
                    name={name}
                />
            ))}
            <p>CompletedMeetings: {user.completedMeetings}</p>
            <h2>Rate: {user.rate}</h2>
            <button onClick={handleReturn}>Все пользователи</button>
        </>
    );
};

User.propTypes = {
    userId: PropTypes.string.isRequired
};

export default User;
