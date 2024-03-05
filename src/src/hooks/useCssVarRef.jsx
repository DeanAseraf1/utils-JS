import { useRef } from "react";

export const useCssVarRef = () => {
    const refs = useRef([]);
    const references = [];

    const handleAssignment = (propsAssignment, style) => {
        const assignments = propsAssignment.replaceAll(/(\s|\t|\n|\r)*/gim, "").split(";")
        assignments.forEach(assignment => {
            const keyValue = assignment.split(":");
            if (keyValue.length === 2)
                style.setProperty(keyValue[0], keyValue[1])
        });
    }

    const refHandler = (ref, vars = { propertyKey: "", propertyValue: "", propsAssignments: "" }) => {
        const { propertyKey, propertyValue, propsAssignments } = vars;

        if (ref && !refs.current.includes(ref)) {
            refs.current.push(ref)

            if(!vars) return refs;
            
            if (ref.hasAttribute("data-ref-name"))
                references.push({ name: ref.getAttribute("data-ref-name"), ref: ref });
            
            if (propertyKey && propertyValue)
                ref.style.setProperty(propertyKey, propertyValue)

            else if (propsAssignments)
                handleAssignment(propsAssignments, ref.style);

        }

        return refs
    }

    //const refUpdater = (refName, vars = { propertyKey: "", propertyValue: "", propsAssignments: "" }) => {
    //    const { propertyKey, propertyValue, propsAssignments } = vars;
    //    const element = references.find(item => item.name === refName);
//
    //    if (element && vars) {
//
    //        if (propertyKey && propertyValue)
    //            element.ref.style.setProperty(propertyKey, propertyValue);
//
    //        else if (propsAssignments)
    //            handleAssignment(propsAssignments, element.ref.style);
    //    }
    //}

    return [refHandler];
}