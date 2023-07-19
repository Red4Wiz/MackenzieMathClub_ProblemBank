// creates a promise for when multiple values are to be added to a table
exports.addMultiple = (db, tableName, columns, values) => {
    return new Promise((resolve, reject) => {
        if(values.length == 0){
            resolve(undefined);
            return;
        }
        let nCols = columns.length;
        // INSERT INTO tableName (col1, col2, ...) VALUES (val1, val2, ...), (val1, val2, ...), ....
        let cols = new Array(values.length).fill("(" + new Array(nCols).fill("?").join(",") + ")").join(",");

        // check each entry is valid
        if(!values.every((el) => el.length == nCols)){
            reject("Length of entry does not correspond to # of columns");
            return;
        }

        // run
        db.run(`INSERT INTO ${tableName} (${columns.join(",")}) VALUES ${cols}`, values.flat(), resolve);
    })
}