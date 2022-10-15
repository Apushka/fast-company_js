import React, { useEffect, useState } from "react";
import * as yup from "yup";
import TextField from "../common/form/textField";
import PropTypes from "prop-types";
import SelectField from "../common/form/selectField";
import api from "../../api";
import RadioField from "../common/form/radioField";
import MultiSelectField from "../common/form/miltiSelectField";
import { useHistory, useParams } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import Loader from "../common/loader";
import { useProfessions } from "../../hooks/useProfession";
import { useQualities } from "../../hooks/useQuality";

const UserEditForm = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        profession: "",
        sex: "male",
        qualities: []
    });
    const [isLoading, setIsLoading] = useState(false);

    const { userId } = useParams();
    const { getUserById } = useUser();
    const { professions } = useProfessions();
    const { qualities } = useQualities();
    const [errors, setErrors] = useState({});
    const isValid = Object.keys(errors).length === 0;
    const history = useHistory();

    useEffect(() => {
        (async () => {
            const user = await getUserById(userId);
            setData(user);
        })();

        // setIsLoading(true);
        // api.users.getById(userId).then(({ profession, qualities, ...rest }) => setData((prevState) => ({
        //     ...prevState,
        //     ...rest,
        //     profession: profession._id,
        //     qualities: transformData(qualities)
        // })));
        // api.professions.fetchAll().then((data) => {
        //     const professionsList = transformData(data);
        //     setProfessions(professionsList);
        // });
        // api.qualities.fetchAll().then((data) => {
        //     const qualitiesList = transformData(data);
        //     setQualities(qualitiesList);
        // });
    }, []);

    function transformData(data) {
        const arr = Array.isArray(data) ? data : Object.values(data);
        return arr.map((item) => {
            const { name: label, _id: value, ...rest } = item;
            return { label, value, ...rest };
        });
    };

    useEffect(() => {
        if (data._id) setIsLoading(false);
    }, [data]);

    useEffect(() => {
        validate();
    }, [data]);

    const validateSchema = yup.object().shape({
        qualities: yup.array(),
        sex: yup.string(),
        profession: yup.string().required("Обязательно выберите вашу профессию"),
        email: yup.string().required("Электронная почта обязательна для заполнения").email("Email введён некорректно"),
        name: yup.string().required("Имя почта обязательно для заполнения")
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
                history.push("/users");
            })
            .catch(() => alert("Что-то пошло не так"));
    };

    if (isLoading) return <Loader />;

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
            options={transformData(professions)}
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
            options={transformData(qualities)}
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
