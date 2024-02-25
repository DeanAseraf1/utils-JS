import { useRef, useState } from "react"

export const useValidate = () => {
    const refs = useRef({});
    const [get, set] = useState(false)
    //Reused functions
    const rerender = () => set(prev => !prev);
    const isInvalid = (id) => refs.current[id] && refs.current[id].message !== null;

    return {
        //Adds a new object field to the refs object and returns the input props as an object.
        /**
        * Registers a new field to the validator.
        * @param {String} id A special string to identify the field, if a field with the same id is already defined, it'll be overwitten.
        * @param {((value)=>String)[]} validations An array of validation functions, each one is expacting a value and returns a validation message string | null.
        * @param {String|Boolean|Number} initialValue The initial value of the input.
        * @param {Boolean} validateOnChange Will this field run it's validations when the input's value has changed.
        * @param {Boolean} validateOnBlur Will this field run it's validations when the input's gets blured.
        * @param {((String|Boolean)=>void)|null} setValue A function to set an external state when the value has changed.
        * @param {((String)=>void)|null} setMessage A function to set an external state when the validation message has changed.
        * @return {Object} An object containning the required input props for the validator functionallity.
        */
        register: (id, validations = [], initialValue = "", options = {}) => {
            const {setValue=null, setMessage=null, onChange=null, validateOnChange=true, onBlur=null, validateOnBlur=true} = options;
            refs.current = {
                ...refs.current, [id]: {
                    props: {
                        value: refs.current[id] ? refs.current[id].props.value : initialValue + "",
                        checked: refs.current[id] ? refs.current[id].props.checked : Boolean(initialValue),
                        onChange: e => {
                            if (validateOnChange) {
                                if(refs.current[id].props.ref.current.getAttribute("type") === "checkbox"){
                                    refs.current[id].props.checked = !refs.current[id].props.checked;
                                } else{
                                    refs.current[id].props.value = e.target.value;
                                } 

                                setValue && setValue(e.target.value);
                                refs.current[id].validateField(false)
                                rerender();
                            }
                            onChange && onChange(e)
                        },

                        onBlur: e => {
                            if (validateOnBlur) {
                                // refs.current[id].props.value = e.target.value;
                                refs.current[id].validateField(false)
                                rerender();
                            }
                            onBlur && onBlur(e)
                        },
                        ref: (element) => refs.current[id].props.ref.current = element

                    },

                    //Validating and presenting one validation message, returns true when the field is valid.
                    /**
                    * Validating and presenting the field's validation message if there's one, returns true when the field is valid.
                    * @param {Boolean} isRerender Rerender's all the validator fields.
                    * @return {Boolean} A boolean representing the field's validity.
                    */
                    validateField: (isRerender = true) => {
                        let isValid = true;
                        for (let i = 0; i < validations.length; i++) {
                            const func = validations[i];
                            // const type = refs.current[id].props.ref.current.getAttribute("type");
                            const value = refs.current[id].props.ref.current.getAttribute("type") === "checkbox" ? refs.current[id].props.checked : refs.current[id].props.value;
                            const res = func(value);
                            if (res !== null) {
                                if (isValid) {
                                    refs.current[id].message = res
                                    setMessage && setMessage(res)
                                }
                                isValid = false;
                            }
                        }
                        if (isValid) {
                            refs.current[id].message = null;
                            setMessage && setMessage(null)
                        }
                        if (isRerender) {
                            rerender();
                        }
                        return isValid;
                    },

                    //Resetting the field to it's initial state.
                    /**
                    * Resetting and clearing the field to it's initial state.
                    */
                    resetField: () => {
                        refs.current[id].message = null;
                        setMessage && setMessage(null)
                    },

                    //Focusing and scrolling to a field.
                    /**
                    * Focusing on the field and scrolling to it.
                    */
                    focusField: () => {
                        refs.current[id].props.ref.current.scrollIntoView({ block: "nearest" });
                        refs.current[id].props.ref.current.focus();
                    },

                    parsedValue: () => {
                        switch(refs.current[id].props.ref.current?.getAttribute("type")){
                            case "checkbox":
                                return refs.current[id].props.checked;
                            case "date":
                                return new Date(refs.current[id].props.value);
                            case "number":
                                return +refs.current[id].props.value;
                            default:
                                return refs.current[id].props.value;
                        }
                    },

                    message: refs.current[id] ? refs.current[id].message : null
                }
            };
            return refs.current[id].props;
        },

        //Validating and presenting all registered validation messages, returns true when all the fields are valid.
        /**
        * Validating and presenting all the field's validation messages if there's any, returns true when all the fields are valid.
        * @param {string[]|null} ids An array of all the fields ids to validate, if null validates all fields.
        * @param {boolean} isRerender Rerender's all the validator fields.
        * @return {Boolean} A boolean representing all the fields validity combined.
        */
        validate: (ids = null, isRerender = true) => {
            const keys = Object.keys(refs.current);
            const values = Object.values(refs.current);
            let isValid = true;
            for (let i = 0; i < keys.length; i++) {
                let res = true;
                if (!ids || ids.includes(keys[i])) {
                    res = values[i].validateField(false);
                    if (res === false) {
                        if (isValid) {
                            values[i].focusField();
                        }
                        isValid = false;
                    }
                }
            }
            if (isRerender) {
                rerender();
            }
            return isValid;
        },

        //Resetting all registered fields to their initial states.
        /**
        * Resetting and clearing all registered fields to their initial states.
        * @param {string[]|null} ids An array of all the fields ids to reset, if null resets all fields.
        */
        reset: (ids = null) => {
            const keys = Object.keys(refs.current);
            const values = Object.values(refs.current);
            for (let i = 0; i < values.length; i++) {
                if (!ids || ids.includes(keys[i])) {
                    values[i].resetField();
                }
            }
            rerender();
        },

        //Running a callback function with the validation message when there's one, and returnning the result.
        /**
        * Running a callback function with the validation message when there's one, and returnning the result.
        * @param {string[]|null} id An existing field's id.
        * @param {string[]|null} callback A function to run when the validation message has set.
        * @return {any} The result of the callback function.
        */
        messageFunction: (id, callback) => {
            if (isInvalid(id)) {
                return callback(refs.current[id].message)
            }
        },

        //Setting and presenting validation message on a certain field.
        /**
        * Setting and presenting validation message on a certain field.
        * @param {string[]|null} id An existing field's id.
        * @param {string|null} message The message to set.
        * @param {string|null} isRerender Rerender's all the validator fields.
        */
        setError: (id, message, isRerender = true) => {
            refs.current[id].message = message;
            if (isRerender) {
                rerender();
            }
        },

        //Setting and presenting a value on a certain field.
        /**
        * Setting and presenting an value on a certain field.
        * @param {string[]|null} id An existing field's id.
        * @param {string} value The value to set.
        * @param {string|null} isRerender Rerender's all the validator fields.
        */
        setValue: (id, value, isRerender = true) => {
            refs.current[id].props.value = value;
            if (isRerender) {
                rerender();
            }
        },

        /**
        * Gets and returns the parsed field's value.
        * @param {string[]|null} id An existing field's id.
        * @return {Boolean|Date|Number|String} The parsed value of the field.
        * 
        */
        getParsedValue: (id) => {
            console.dir(refs.current[id].props.ref)
            switch(refs.current[id].props.ref.current?.getAttribute("type")){
                case "checkbox":
                    return refs.current[id].props.checked;
                case "date":
                    return new Date(refs.current[id].props.value);
                case "number":
                    return +refs.current[id].props.value;
                default:
                    return refs.current[id].props.value;
            }
        },
        
        /**
        * Gets and returns a value from a certain field.
        * @param {string[]|null} id An existing field's id.
        * @return {string} The value of the input.
        */
        getValue: (id) => refs.current[id].props.value,

        /**
        * Gets and returns a full reference of ceratin field.
        * @param {string[]|null} id An existing field's id.
        * @return {Object} The full reference of the input.
        * 
        */
        getRef: (id) => refs.current[id],

        /**
        * Gets and returns the validity of a certain field.
        * @param {string[]|null} id An existing field's id.
        * @return {string} The validity of the field.
        */
        isInvalid: isInvalid,

        /**
        * Rerender's all the validator fields.
        */
        rerender: rerender,

        /**
        * Retreving all the references.
        */
        refs: refs
    }
}

export const defaultValidations = {
    /**
    * Returning the message if the val is "" | false, else returns null.
    * @param {String|null} message The validation message.
    * @return {String|null} The validation message.
    */
    required: (message = "Required field") => (val) => typeof(val) === "string" && val === "" ? message : typeof(val) === "boolean" && val === false ? message : null,

    /**
    * Returning the message if isNaN(new Date(val)), else returns null.
    * @param {String|null} message The validation message.
    * @return {String|null} The validation message.
    */
    date: (message = "Invalid date") => (val) => isNaN(new Date(val).getTime()) ? message : null,

    /**
    * Returning the message if the date is overlapping with the range, else returns null.
    * @param {String|null} message The validation message.
    * @return {String|null} The validation message.
    */
    dateRange: (from = null, to = null, message = "Invalid date range", innerRanger = true) => (val) => {
        if(innerRanger){
            if(from !== null && new Date(val).getTime() < new Date(from).getTime())
                return message;
            if(to !== null && new Date(val).getTime() > new Date(to).getTime())
                return message;
            return null;
        }
        else{
            if(from !== null && new Date(val).getTime() > new Date(from).getTime() && 
            to !== null && new Date(val).getTime() < new Date(to).getTime())
                return message;
            return null;
        }
    },

    /**
    * Returning the message if +val < minValue, else returns null.
    * @param {Number} minValue The minimun value of the input.
    * @param {String|null} message The validation message.
    * @return {String|null} The validation message.
    */
    min: (minValue, message = `Smaller than ${minValue}`) => (val) => +val < minValue ? message : null,

    /**
    * Returning the message if +val > maxValue, else returns null.
    * @param {Number} maxValue The maximum value of the input.
    * @param {String|null} message The validation message.
    * @return {String|null} The validation message.
    */
    max: (maxValue, message = `Bigger than ${maxValue}`) => (val) => +val > maxValue ? message : null,

    /**
    * Returning the message if val.length < minLengthValue, else returns null.
    * @param {Number} minLengthValue The minimum length of the input's value.
    * @param {String|null} message The validation message.
    * @return {String|null} The validation message.
    */
    minLength: (minLengthValue, message = `Smaller than ${minLengthValue} characters`) => (val) => val.length < minLengthValue ? message : null,

    /**
    * Returning the message if val.length > maxLengthValue, else returns null.
    * @param {Number} maxLengthValue The maximum length of the input's value.
    * @param {String|null} message The validation message.
    * @return {String|null} The validation message.
    */
    maxLength: (maxLengthValue, message = `Bigger than ${maxLengthValue} characters`) => (val) => val.length > maxLengthValue ? message : null,
}


