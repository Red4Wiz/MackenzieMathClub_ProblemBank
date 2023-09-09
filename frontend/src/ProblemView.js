import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {ROUTES} from './routes';
import Markdown from './markdown';
import { Link } from 'react-router-dom';

export const ProblemTop = ({problem}) => {
    return <div className='h-flex' style={{justifyContent: 'space-between'}}>
    <Link className='header-link' to={`/problem-edit/${problem.id}`} onClick={(e) => e.stopPropagation()}>
      <p>{problem.title}</p>
    </Link>
    <p style={{marginRight: '0', color: 'lightgrey'}}>By {problem.author.firstname} {problem.author.lastname} ({problem.author.username})</p>
    </div>
}

export const ProblemTags = ({problem}) => {
    return <div className='h-flex' style={{justifyContent: 'space-between', marginTop: '10px'}}>
    <div className='h-flex' style={{gap: '10px'}}>
      {problem.problem_tags.map((tag) => <div className='topic-tag' key={tag.id}>{tag.name}</div>)}
    </div>

    <div className='h-flex' style={{gap: '10px'}}>
      {problem.contest_tags.map((tag) => <div className='contest-tag' key={tag.id}>{tag.name}</div>)}
    </div>
  </div>
}

const ProblemCard = ({problem}) => {
    const [sol, setSol] = useState(false)

    return <div className='problem-item' style={{margin: '10px auto', padding: '0 15px', paddingBottom: '1em'}}>
        {!problem ? <>Loading...</> : 
            <div>
                <ProblemTop problem={problem}></ProblemTop>
                <Markdown className='statement-desc'>{problem.statement}</Markdown>
                <ProblemTags problem={problem}></ProblemTags>
                <hr></hr>
                <input className='solid-rect black-bg clickable' type='button' value='Toggle Solution' onClick={() => setSol(!sol)}></input>
                {sol && <div>
                    <p style={{textAlign: 'left'}}>Solution</p>
                    <Markdown className='statement-desc'>{problem.solution}</Markdown>
                </div>}
            </div>
        }
    </div>
}

const ProblemView = () => {
    const { id } = useParams();
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(undefined);
    const [problem, setProblem] = useState({});
    
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
        <ProblemCard problem={problem}></ProblemCard>
        );
    }
}

export default ProblemView;