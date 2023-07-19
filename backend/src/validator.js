// checks if a type is what's intended
const isType = (value, type) => {
    if(type == "integer") return Number.isInteger(value);
    if(type == "string") return typeof value == "string";
    if(type == "array") return Array.isArray(value);
    if(type == "array_string") return Array.isArray(value) && value.every((val) => typeof val == "string");
    if(type == "array_int") return Array.isArray(value) && value.every(Number.isInteger);
    else throw new Error(`Unfound type ${type}`);
}

// checks if the types are correct, types = array of (value, parameter name for feedback, type)
exports.checkTypes = (types) => {
    let successful = true;
    let messages = []
    types.forEach((el) => {
        let [val, paramName, type] = el;
        if(!isType(val, type)){
            successful = false;
            messages.push(`${paramName} should be of type ${type}`);
        }
    })
    return [successful, messages]
};