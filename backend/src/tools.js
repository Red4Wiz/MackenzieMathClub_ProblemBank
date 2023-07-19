exports.hasDuplicate = (arr) => {
    return (new Set(arr)).size < arr.length;
}