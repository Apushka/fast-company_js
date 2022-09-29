import React from "react";
import PropTypes from "prop-types";
import Quality from "./quality";
import { useQuality } from "../../../hooks/useQuality";
import Loader from "../../common/loader";

const QualitiesList = ({ qualities }) => {
    const { isLoading } = useQuality();

    if (isLoading) return <Loader />;
    return (
        <>
            {qualities.map((qual) => (
                <Quality key={qual} id={qual} />
            ))}
        </>
    );
};

QualitiesList.propTypes = {
    qualities: PropTypes.array
};

export default QualitiesList;
