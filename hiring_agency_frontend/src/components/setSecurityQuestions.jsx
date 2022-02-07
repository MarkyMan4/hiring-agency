import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setSecurityQuestion } from '../api/authRequests';
import { getSecurityQuestionOptions } from '../api/staticDataRequests';
import { getAuthToken } from '../utils/storage';

// when a user first logs in, they must select security questions and enter their answers
function SetSecurityQuestions() {
    let navigate = useNavigate();
    const [options, setOptions] = useState([]);
    const [question1, setQuestion1] = useState(1);
    const [question2, setQuestion2] = useState(1);
    const [question3, setQuestion3] = useState(1);
    const [answer1, setAnswer1] = useState();
    const [answer2, setAnswer2] = useState();
    const [answer3, setAnswer3] = useState();
    const [message, setMessage] = useState('');

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
        // do some validation
        if(question1 === question2 || question1 === question3 || question2 === question3) {
            setMessage('please select three distinct questions');
        }
        else {
            setMessage('');

            // save each question
            setSecurityQuestion(getAuthToken(), question1, answer1);
            setSecurityQuestion(getAuthToken(), question2, answer2);
            setSecurityQuestion(getAuthToken(), question3, answer3);

            // then redirect user to home page
            navigate('/');
        }
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

            <div className="mt-3">{ message }</div>
        </div>
    );
}

export default SetSecurityQuestions;