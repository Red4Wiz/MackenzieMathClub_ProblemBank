import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {ROUTES} from './routes';

const ProblemView = () => {
    const { id } = useParams();
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(undefined);
    const [problem, setProblem] = useState({});
    const [solutionHidden, setSolutionHidden] = useState(true);
    console.log(`${ROUTES.api}/problem/get/${id}`)
    useEffect(() => {
        fetch(`${ROUTES.api}/problem/get/${id}`).then((res) => {
            if(res.status === 200){
                res.json().then((val) => {
                    setReady(true);
                    setProblem(val);
                })
            } else if(res.status === 400){
                setReady(true);
                setError('Please ensure your id is a positive integer');
            } else {
                setReady(true);
                setError("Couldn't find problem");
            }
        })
    }, [id]);

    if(!ready) return <>Loading...</>
    else if(error) return <>{error}</>
    else {
        return(
        <div>
            <h2>{problem.title}</h2>
            <p>Author: {problem.author}</p>
            <hr />
            <div>
                <h4>Problem Statement</h4>
                <p>{problem.statement}</p>
            </div>
            <p>
                <b>Problem Types: </b>
                {problem.problem_tags.map((tagName) => <span key={`problem-tag:${tagName}`}>{tagName}</span>)}
            </p>
            <p>
                <b>Contest Types: </b>
                {problem.contest_tags.map((tagName) => <span key={`contest-tag:${tagName}`}>{tagName}</span>)}
            </p>
            <button onClick={() => setSolutionHidden(!solutionHidden)}>Toggle Solution</button>
            <div>
                {!solutionHidden && 
                    <div>
                        <h4>Problem Solution</h4>
                        <p>{problem.solution}</p>
                    </div>
                }
            </div>
        </div>
        );
    }
}

export default ProblemView;