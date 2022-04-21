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
    const [question2, setQuestion2] = useState(2);
    const [question3, setQuestion3] = useState(3);
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

    const isAlphaNumeric = (str) => {
        const regex = /[0-9a-zA-Z]/;
        
        for(let i = 0; i < str.length; i++) {
            if(!str.charAt(i).match(regex)) {
                return false;
            }
        }

        return true;
    }

    // security question must be at least 4 characters, no spaces, only alphanumeric
    const isAnswerValid = (answer) => {
        const hasNoWhiteSpace = !(answer.indexOf(' ') >= 0);
        const isLongEnough = answer.length >= 4;

        return hasNoWhiteSpace && isLongEnough && isAlphaNumeric(answer);
    }

    const handleSubmitClicked = () => {
        // do some validation
        if(parseInt(question1) === parseInt(question2) || parseInt(question1) === parseInt(question3) || parseInt(question2) === parseInt(question3)) {
            setMessage('please select three distinct questions');
        }
        else if(!isAnswerValid(answer1) || !isAnswerValid(answer2) || !isAnswerValid(answer3)) {
            setMessage('answer must be at least four characters, contain no whitespace and only contain alphanumeric characters');
        }
        else {
            setMessage('');

            const data = [
                {
                    question: question1,
                    answer: answer1
                },
                {
                    question: question2,
                    answer: answer2
                },
                {
                    question: question3,
                    answer: answer3
                }
            ];

            // save each question
            setSecurityQuestion(getAuthToken(), data);

            // then redirect user to home page
            navigate('/');
        }
    }

    return (
        <div>
            <h4>Please select your security questions and answers.</h4>
            <div>
                Answer must be at least four characters, contain no whitespace and only contain alphanumeric characters.
            </div>
            <hr />

            {/* Note: options are filtered so that the user is not allowed to select two of the same security question */}
            <select value={ question1 } onChange={ handleQuestion1Select } className="form-select w-25">
                { 
                    options
                        .filter(o => parseInt(o.id) !== parseInt(question2) && parseInt(o.id) !== parseInt(question3))
                        .map(o => <option key={ o.id } value={ o.id }>{ o.question }</option>) 
                }
            </select>

            <input placeholder="enter your answer here" onChange={ handleAnswer1Input } className="form-control w-25 mt-2"></input><br />

            <select value={ question2 } onChange={ handleQuestion2Select } className="form-select w-25">
                { 
                    options
                        .filter(o => parseInt(o.id) !== parseInt(question1) && parseInt(o.id) !== parseInt(question3))
                        .map(o => <option key={ o.id } value={ o.id }>{ o.question }</option>) 
                }
            </select>

            <input placeholder="enter your answer here" onChange={ handleAnswer2Input } className="form-control w-25 mt-2"></input><br />

            <select value={ question3 } onChange={ handleQuestion3Select } className="form-select w-25">
                { 
                    options
                        .filter(o => parseInt(o.id) !== parseInt(question1) && parseInt(o.id) !== parseInt(question2))
                        .map(o => <option key={ o.id } value={ o.id }>{ o.question }</option>) 
                }
            </select>

            <input placeholder="enter your answer here" onChange={ handleAnswer3Input } className="form-control w-25 mt-2"></input><br />

            <button onClick={ handleSubmitClicked } className="btn btn-success mt-3">Submit</button>

            <div className="mt-3">{ message }</div>
        </div>
    );
}

export default SetSecurityQuestions;