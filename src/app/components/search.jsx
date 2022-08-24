import React from "react";
import PropTypes from "prop-types";
import TextField from "./textField";

const Search = ({ value, onChange }) => {
    return <form>
        <TextField
            type="search"
            value={value}
            name="search"
            placeholder={"Искать..."}
            onChange={onChange} />
    </form>;
};

Search.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default Search;
