const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const express = require('express');
const validator = require('./validator');

const db = new sqlite3.Database("data.db", sqlite3.OPEN_READWRITE, (err) => {
    if(err){
        console.log(err.message);
    }
    console.log("Connected to problem bank database");
});

const app = express()
const port = 8080
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.get("/api/problem/get/:id", (req, res, next) => {
    try{
        // parse id
        const id = parseInt(req.params.id);
        if(isNaN(id)) {
            res.status(400).send("id must be integral");
            return;
        }

        // find the intended problem (if it doesn't exist, then this won't run)
        db.get("SELECT * FROM Problems WHERE id=?", id, (err, row) => {
            if(err) throw err;
            if(!row) {
                res.status(404).send("couldn't find the problem");
                return;
            }

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
    } catch(e) {
        console.log(`Error with ${id}:`)
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/api/problem/create", (req, res, next) => {
    try{
        // extract the types and check them
        let [author, title, statement, solution, problemTags, contestTags] = 
                [req.body.author, req.body.title, req.body.statement, req.body.solution, req.body.problemTags, req.body.contestTags];
        const paramTypes = [ 
            [author, "author id", "integer"],
            [title, "problem title", "string"],
            [statement, "problem statement", "string"],
            [solution, "problem solution", "string"],
            [problemTags, "problem tags", "array_int"],
            [contestTags, "problem contest tags", "array_int"]
        ];
        let [typeSuccess, errorMessages] = validator.checkTypes(paramTypes)
        if(!typeSuccess) {
            res.status(400).send(errorMessages);
            return;
        }

        // insert problem into database
        db.run("INSERT INTO Problems (author, title, statement, solution) VALUES (?, ?, ?, ?)", [author, title, statement, solution], function(err) {
            if(err) throw err;

            // insert all problem tag relationships into the database
            let pId = this.lastID;
            let sql = "INSERT INTO Problem_to_ProblemTag (problem_id, tag_id) VALUES " + Array(problemTags.length).fill("(?, ?)").join(", ");
            let args = problemTags.reduce((acc, tagId) => {
                acc.push(pId);
                acc.push(tagId);
                return acc;
            }, [])

            db.run(sql, args, (err) => {
                // insert all contest tag relationships into the database
                if(err) throw err;
                let sql = "INSERT INTO Problem_to_ContestTag (problem_id, tag_id) VALUES " + Array(problemTags.length).fill("(?, ?)").join(", ");
                let args = contestTags.reduce((acc, tagId) => {
                    acc.push(pId);
                    acc.push(tagId);
                    return acc;
                }, [])
                db.run(sql, args, (err) => {
                    if(err) throw err;
                    res.status(201).json({'id': pId});
                })
            })
        })
    } catch (e) {
        console.log("Creation Error!");
        console.log(req.body);
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});