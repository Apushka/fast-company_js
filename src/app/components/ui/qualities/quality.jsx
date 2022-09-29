import React from "react";
import PropTypes from "prop-types";
import { useQuality } from "../../../hooks/useQuality";

const Quality = ({ id }) => {
    const { isLoading, getQuality } = useQuality();
    const { color, name } = getQuality(id);

    if (!isLoading) {
        return <span className={"badge m-1 bg-" + color}>{name}</span>;
    };
    return "Loading...";
};
Quality.propTypes = {
    id: PropTypes.string
};

export default Quality;
