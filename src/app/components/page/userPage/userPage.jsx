import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../../../api";
import Loader from "../../common/loader";
import UserCard from "../../ui/userCard";
import QualitiesCard from "../../ui/qualitiesCard";
import MeetingsCard from "../../ui/meetingsCard";
import Comments from "../../ui/comments";

const UserPage = ({ userId }) => {
    const [user, setUser] = useState();

    useEffect(() => {
        api.users.getById(userId).then((user) => setUser(user));
    }, []);

    if (!user) return <Loader />;

    return (
        <div className="container">
            <div className="row gutters-sm">
                <div className="col-md-4 mb-3">
                    <UserCard user={user} />
                    <QualitiesCard qualities={user.qualities} />
                    <MeetingsCard meetings={user.completedMeetings} />
                </div>
                <div className="col-md-8">
                    <Comments />
                </div>
            </div>
        </div>
    );
};

UserPage.propTypes = {
    userId: PropTypes.string.isRequired
};

export default UserPage;
