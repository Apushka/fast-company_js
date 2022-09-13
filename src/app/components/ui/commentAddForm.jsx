import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../../api";
import { validator } from "../../utils/validator";
import SelectField from "../common/form/selectField";
import TextAreaField from "../common/form/textAreaField";

const initialData = {
    userId: "",
    content: ""
};

const CommentAddForm = ({ onSubmit }) => {
    const [users, setUsers] = useState([]);
    const [data, setData] = useState(initialData);

    const [errors, setErrors] = useState({});
    const isValid = Object.keys(errors).length === 0;

    useEffect(() => {
        api.users.fetchAll()
            .then(users => setUsers(users.map(user => ({
                value: user._id,
                label: user.name
            }))));
    }, []);

    useEffect(() => {
        if (data !== initialData) validate();
    }, [data]);

    const handleChange = (target) => {
        setData(prevState => ({ ...prevState, [target.name]: target.value }));
    };

    const validatorConfig = {
        userId: {
            isRequired: {
                message: "Выберите от чьего имени вы пишите"
            }
        },
        content: {
            isRequired: {
                message: "Сообщение не должно быть пустым"
            }
        }
    };

    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        onSubmit(data);
        clearForm();
    };

    const clearForm = () => {
        setData(initialData);
        setErrors({});
    };

    return <div>
        <h2>New comment</h2>
        <form onSubmit={handleSubmit}>
            <SelectField
                options={users}
                name="userId"
                onChange={handleChange}
                defaultOption="Выберите пользователя"
                error={errors.userId}
                value={data.userId}
            />
            <TextAreaField
                label="Сообщение"
                name="content"
                value={data.content}
                onChange={handleChange}
                error={errors.content} />
            <div className="d-flex justify-content-end">
                <button className="btn btn-primary" disabled={!isValid}>Опубликовать</button>
            </div>
        </form>
    </div>;
};

CommentAddForm.propTypes = {
    onSubmit: PropTypes.func
};

export default CommentAddForm;
