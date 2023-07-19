const sqlite3 = require("sqlite3")
const express = require('express')

const db = new sqlite3.Database("data.db", sqlite3.OPEN_READWRITE, (err) => {
    if(err){
        console.log(err.message);
    }
    console.log("Connected to problem bank database");
});

const app = express()
const port = 8080

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.get("/api/problem/get/:id", (req, res) => {
    // parse id
    const id = parseInt(req.params.id);
    if(isNaN(id)) throw new Error("Problem id must be integral");

    // see if the problem exists
    if(db.get("SELECT COUNT(id) cnt FROM Problems WHERE id=?", id, (err, row) => {
        if(err) throw err;
        if(row.cnt == 0) {
            // if not, then return 404
            res.status(404).send("couldn't find the problem");
        } else if(row.cnt > 1){
            // more error trapping
            console.log(`Problem ID ${id} returned multiple problems`);
            throw new Error("SQLITE3 query error");
        }
    }))

    // find the intended problem (if it doesn't exist, then this won't run)
    db.get("SELECT * FROM Problems WHERE id=?", id, (err, row) => {
        if(err) throw err;
        const allowed_headings = ["id", "author", "title", "statement", "solution"];

        // info tags
        let info = Object.fromEntries(allowed_headings.map((val) => [val, row[val]]));
        info.contest_tags = [];

        // select all tags corresponding to current problem
        const problem_tag_sql = `SELECT tags.name FROM
                                Problem_to_ProblemTag as pt INNER JOIN ProblemTags as tags
                                ON tags.id = pt.tag_id
                                WHERE pt.problem_id = ?`
        const contest_tag_sql = `SELECT tags.name FROM
                                Problem_to_ContestTag as pt INNER JOIN ContestTags as tags
                                ON tags.id = pt.tag_id
                                WHERE pt.problem_id = ?`

        // find names of problem tags
        db.all(problem_tag_sql, [id], (err, rows) => {
            if(err) throw err;
            info.problem_tags = rows.map((row) => row.name);
            // find names of contest tags
            db.all(contest_tag_sql, [id], (err, rows) => {
                if(err) throw err;
                info.contest_tags = rows.map((row) => row.name);
                res.json(info);
            })
        })
    })
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});