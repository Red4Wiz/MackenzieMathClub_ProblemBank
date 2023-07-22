const sqlite3 = require("sqlite3");
const bodyParser = require('body-parser');
const express = require('express');
const dbTools = require('./db_alter');
const tools = require('./tools');
const Ajv = require('ajv');
const ajv = new Ajv();
const schemas = require('./schemas');

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
        let id = req.params.id;
        if(isNaN(id)){
            res.status(400).send("id must be an integer");
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

app.get("/api/problemTags", (req, res, next) => {
    try{
        db.all("SELECT id, name FROM ProblemTags", (err, rows) => {
            if(err) throw err;
            res.json(rows.map((row) => {
                return {
                    id: row.id,
                    name: row.name
                }
            }));
        })
    } catch(e) {
        console.log("problem tag errored out");
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
})

app.get("/api/contestTags", (req, res, next) => {
    try{
        db.all("SELECT id, name FROM ContestTags", (err, rows) => {
            if(err) throw err;
            res.json(rows.map((row) => {
                return {
                    id: row.id,
                    name: row.name
                }
            }));
        })
    } catch(e) {
        console.log("contest tag errored out");
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
})

app.post("/api/problem/create", (req, res, next) => {
    try{
        // validate input
        const valid = schemas.problemCreate(req.body);
        if(!valid){
            res.status(400).send(schemas.problemCreate.errors);
            return;
        }

        // extract the types and check them
        let [author, title, statement, solution, problemTags, contestTags] = 
                [req.body.author, req.body.title, req.body.statement, req.body.solution, req.body.problemTags, req.body.contestTags];

        // insert problem into database
        db.run("INSERT INTO Problems (author, title, statement, solution) VALUES (?, ?, ?, ?)", [author, title, statement, solution], function(err) {
            if(err) throw err;
            // insert all problem tag relationships into the database
            let pId = this.lastID;

            dbTools.addMultiple(db, "Problem_to_ProblemTag", ["problem_id", "tag_id"], problemTags.map((el) => [pId, el])).then((err) => {
                // insert all contest tag relationships into the database
                if(err) throw err;

                dbTools.addMultiple(db, "Problem_to_ContestTag", ["problem_id", "tag_id"], contestTags.map((el) => [pId, el])).then((err) => {
                    if(err) throw err;
                    res.status(200).json({'id': pId});
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

app.post("/api/problem/alter", (req, res, next) => {
    try{
        // validate input
        const valid = schemas.problemAlter(req.body);
        if(!valid){
            res.status(400).send(schemas.problemCreate.errors);
            return;
        }

        // update the problem parameters
        db.run("UPDATE Problems SET author=?, title=?, statement=?, solution=? WHERE id=?", [author, title, statement, solution, id], (err) => {
            if(err) throw err;

            // delete contest & problem tags (to later re-add them)
            db.run("DELETE FROM Problem_to_ProblemTag WHERE problem_id=?", [id], (err) => {
                if(err) throw err;
                db.run("DELETE FROM Problem_to_ContestTag WHERE problem_id=?", [id], (err) => {
                    if(err) throw err;

                    // add problem & contest tags
                    dbTools.addMultiple(db, "Problem_to_ProblemTag", ["problem_id", "tag_id"], problemTags.map((el) => [id, el])).then((err) => {
                        if(err) throw err;

                        dbTools.addMultiple(db, "Problem_to_ContestTag", ["problem_id", "tag_id"], contestTags.map((el) => [id, el])).then((err) => {
                            if(err) throw err;
                            // return a successful status
                            res.status(200).end();
                        }, (reason) => {throw new Error(reason);});

                    }, (reason) => {throw new Error(reason);});
                });
            });
        });
    } catch(e) {
        console.log("Alter Error!");
        console.log(req.body);
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});