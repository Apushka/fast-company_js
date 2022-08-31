import React, { useEffect, useState } from "react";
import * as yup from "yup";
import TextField from "../common/form/textField";
import PropTypes from "prop-types";
import SelectField from "../common/form/selectField";
import api from "../../api";
import RadioField from "../common/form/radioField";
import MultiSelectField from "../common/form/miltiSelectField";
import { useHistory, useParams } from "react-router-dom";
import Loader from "../common/loader";

const UserEditForm = () => {
    const [data, setData] = useState();

    const { userId } = useParams();
    const [professions, setProfessions] = useState();
    const [qualities, setQualities] = useState([]);
    const [errors, setErrors] = useState({});
    const isValid = Object.keys(errors).length === 0;
    const history = useHistory();

    useEffect(() => {
        api.users.getById(userId).then((user) => setData(() => ({
            name: user.name,
            email: user.email,
            profession: user.profession._id,
            sex: user.sex,
            qualities: user.qualities.map(quality => ({ label: quality.name, value: quality._id, color: quality.color }))
        })));
        api.professions.fetchAll().then((data) => {
            const professionsList = Object.keys(data).map((professionName) => ({
                label: data[professionName].name,
                value: data[professionName]._id
            }));
            setProfessions(professionsList);
        });
        api.qualities.fetchAll().then((data) => {
            const qualitiesList = Object.keys(data).map((optionName) => ({
                label: data[optionName].name,
                value: data[optionName]._id,
                color: data[optionName].color
            }));
            setQualities(qualitiesList);
        });
    }, []);

    useEffect(() => {
        validate();
    }, [data]);

    const validateSchema = yup.object().shape({
        name: yup.string().required("Имя почта обязательно для заполнения"),
        email: yup.string().required("Электронная почта обязательна для заполнения").email("Email введён некорректно"),
        profession: yup.string().required("Обязательно выберите вашу профессию"),
        sex: yup.string(),
        qualities: yup.array()
    });

    const validate = () => {
        validateSchema.validate(data)
            .then(() => setErrors({}))
            .catch((error) => setErrors({ [error.path]: error.message }));
        return Object.keys(errors).length === 0;
    };

    const handleChange = (target) => {
        setData(prevState => ({ ...prevState, [target.name]: target.value }));
    };

    const getProfessionById = (id) => {
        for (const prof of professions) {
            if (prof.value === id) {
                return { _id: prof.value, name: prof.label };
            }
        }
    };
    const getQualities = (elements) => {
        const qualitiesArray = [];
        for (const elem of elements) {
            for (const quality in qualities) {
                if (elem.value === qualities[quality].value) {
                    qualitiesArray.push({
                        _id: qualities[quality].value,
                        name: qualities[quality].label,
                        color: qualities[quality].color
                    });
                }
            }
        }
        return qualitiesArray;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        const { profession, qualities } = data;
        const updatedData = {
            ...data,
            profession: getProfessionById(profession),
            qualities: getQualities(qualities)
        };
        api.users.update(userId, updatedData)
            .then(() => {
                alert("Изменения успешно сохранены");
                history.push("/users");
            })
            .catch(() => alert("Что-то пошло не так"));
    };

    if (!data || !professions || qualities.length === 0) return <Loader />;

    return <form onSubmit={handleSubmit}>
        <TextField
            name="name"
            label="Имя"
            error={errors.name}
            value={data.name}
            onChange={handleChange}
        />
        <TextField
            label="Электронная почта"
            name="email"
            value={data.email}
            onChange={handleChange}
            error={errors.email} />
        <SelectField
            label="Выберите вашу профессию"
            options={professions}
            name="profession"
            onChange={handleChange}
            defaultOption="Choose..."
            error={errors.profession}
            value={data.profession}
        />
        <RadioField
            options={[
                { name: "Male", value: "male" },
                { name: "Female", value: "female" },
                { name: "Other", value: "other" }
            ]}
            value={data.sex}
            name="sex"
            onChange={handleChange}
            label="Выберите ваш пол"
        />
        <MultiSelectField
            options={qualities}
            onChange={handleChange}
            defaultValue={data.qualities}
            name="qualities"
            label="Выберите ваши качества" />
        <button className="btn btn-primary w-100 mx-auto" disabled={!isValid}>Submit</button>
    </form>;
};

UserEditForm.propTypes = {
    user: PropTypes.object
};

export default UserEditForm;
