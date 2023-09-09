import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {ROUTES} from './routes';
import Markdown from './markdown';

const ProblemView = () => {
    const { id } = useParams();
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(undefined);
    const [problem, setProblem] = useState({});
    const [solutionHidden, setSolutionHidden] = useState(true);
    
    useEffect(() => {
        fetch(`${ROUTES.api}/problem/get/${id}`, {'headers': {'Authorization': localStorage.getItem('token')}}).then((res) => {
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
            <p>Author: {problem.author.username}</p>
            <hr />
            <div>
                <h4>Problem Statement</h4>
                <Markdown>{problem.statement}</Markdown>
            </div>
            <p>
                <b>Problem Types: </b>
                {problem.problem_tags.map((tagName) => <span key={`problem-tag:${tagName.name}`}>{tagName.name}</span>)}
            </p>
            <p>
                <b>Contest Types: </b>
                {problem.contest_tags.map((tagName) => <span key={`contest-tag:${tagName.name}`}>{tagName.name}</span>)}
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