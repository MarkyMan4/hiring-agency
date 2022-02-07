import React, { useEffect, useState } from 'react';
import { getSecurityQuestionOptions } from '../api/staticDataRequests';

// when a user first logs in, they must select security questions and enter their answers
function SetSecurityQuestions() {
    const [options, setOptions] = useState([]);
    const [question1, setQuestion1] = useState();
    const [question2, setQuestion2] = useState();
    const [question3, setQuestion3] = useState();
    const [answer1, setAnswer1] = useState();
    const [answer2, setAnswer2] = useState();
    const [answer3, setAnswer3] = useState();

    useEffect(() => {
        getSecurityQuestionOptions()
            .then(res => setOptions(res))
            .catch(err => console.log(err));
    }, []);

    const handleQuestion1Select = (event) => {
        setQuestion1(event.target.value);
    }

    const handleQuestion2Select = (event) => {
        setQuestion2(event.target.value);
    }

    const handleQuestion3Select = (event) => {
        setQuestion3(event.target.value);
    }

    const handleAnswer1Input = (event) => {
        setAnswer1(event.target.value);
    }

    const handleAnswer2Input = (event) => {
        setAnswer2(event.target.value);
    }

    const handleAnswer3Input = (event) => {
        setAnswer3(event.target.value);
    }

    const handleSubmitClicked = () => {
        
    }

    return (
        <div>
            <h4>Please select your security questions and answers.</h4>
            <div>
                Answers must be a single word and a minimum of four characters.
            </div>
            <hr />

            <select value={ question1 } onChange={ handleQuestion1Select } className="form-select w-25">
                { options.map(o => <option key={ o.id } value={ o.id }>{ o.question }</option>) }
            </select>

            <input placeholder="enter your answer here" onChange={ handleAnswer1Input } className="form-control w-25 mt-2"></input><br />

            <select value={ question2 } onChange={ handleQuestion2Select } className="form-select w-25">
                { options.map(o => <option key={ o.id } value={ o.id }>{ o.question }</option>) }
            </select>

            <input placeholder="enter your answer here" onChange={ handleAnswer2Input } className="form-control w-25 mt-2"></input><br />

            <select value={ question3 } onChange={ handleQuestion3Select } className="form-select w-25">
                { options.map(o => <option key={ o.id } value={ o.id }>{ o.question }</option>) }
            </select>

            <input placeholder="enter your answer here" onChange={ handleAnswer3Input } className="form-control w-25 mt-2"></input><br />

            <button onClick={ handleSubmitClicked } className="btn btn-success mt-3">Submit</button>
        </div>
    );
}

export default SetSecurityQuestions;