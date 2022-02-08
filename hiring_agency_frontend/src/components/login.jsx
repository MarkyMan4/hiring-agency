import React, { useEffect, useState } from "react";
import { getSecurityQuestionsForUser, getUser, lockAccount, login } from "../api/authRequests";
import { setAuthToken } from "../utils/storage";
import { isUserLoggedIn } from "../utils/storage";
import { useNavigate } from 'react-router-dom';

function Login() {
    let navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [allSecurityQuestions, setAllSecurityQuestions] = useState([]);
    const [securityQuestion, setSecurityQuestion] = useState({});
    const [securityQuestionAnswer, setSecurityQuestionAnswer] = useState('');
    const [securityQuestionMessage, setSecurityQuestionMessage] = useState('');
    // store the auth token in state after authenticating, we'll save it to local storage after they answer a security questions
    const [token, setToken] = useState(''); 

    useEffect(() => {
        if(isUserLoggedIn())
            navigate('/');
    });

    useEffect(() => {
        // once the user authenticates, retrieve their security questions
        getSecurityQuestionsForUser(token)
            .then(res => setAllSecurityQuestions(res))
            .catch(err => console.log(err));
    }, [token]);

    // whenever the list of available security questions changes,
    // pick a new one at random to display to the user
    // the idea is that whenever they get one wrong, we'll remove it from the list and choose another
    useEffect(() => {
        // first time this runs, allSecurityQuestions may be null, so just put a check here
        if(allSecurityQuestions) {
            const randIndx = Math.floor(Math.random() * allSecurityQuestions.length);
            setSecurityQuestion(allSecurityQuestions[randIndx]);
        }
    }, [allSecurityQuestions]);
    
    const loginClicked = () => {
        login(username, password)
            .then(res => {
                let tkn = res.token;

                if(res.isFirstLogin) {
                    setAuthToken(res.token);
                    navigate('/change_password?info=firstlogin');
                    window.location.reload();
                }
                else {
                    setIsAuthenticated(true);

                    // check if the account is locked, if it is, stop here
                    getUser(res.token)
                        .then(res => {
                            if(res.is_locked) {
                                setAuthToken(tkn); // auth token needs to be in local storage to determine account is locked
                                window.location.reload();
                            }
                            else {
                                // otherwise set the token, this will trigger the use effect to get security questions
                                setToken(tkn);
                            }
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch(err => setLoginMessage('Incorrect credentials'));
    }

    const usernameChanged = (event) => {
        setUsername(event.target.value);
    }

    const passwordChanged = (event) => {
        setPassword(event.target.value);
    }

    const answerChanged = (event) => {
        setSecurityQuestionAnswer(event.target.value);
    }

    const handleAnswerSubmitted = () => {
        // if they got the answer wrong, display a message and remove that item from the list
        // this will cause a new security question to get selected
        if(securityQuestionAnswer !== securityQuestion.answer) {
            setSecurityQuestionMessage('That is the incorrect answer');
            const newQuestionSet = allSecurityQuestions.filter(q => q.question !== securityQuestion.question);

            // if they failed to answer any of their security questions, lock their account
            if(newQuestionSet.length === 0) {
                lockAccount(token);
                setAuthToken(token); // auth token needs to be in local storage to determine account is locked
                window.location.reload();
            }
            else {
                setAllSecurityQuestions(newQuestionSet);
            }
        }
        else {
            // save the token to local storage and refresh the page
            // this will trigger the first useEffect and redirect them to home
            // at this point they are officially logged in
            setAuthToken(token);
            window.location.reload();
        }
    }

    // if the user is already logged in, redirect to home page
    const getLoginOrSecurityQuestions = () => {
        if(isAuthenticated) {
            return (
                <div>
                    <h3 className="mt-2">Security Question</h3>
                    <hr />
                    <label className="mt-3">{ securityQuestion ? securityQuestion.question_name : '' }</label><br />
                    <input value={ securityQuestionAnswer } onChange={ answerChanged } placeholder="enter your answer here" className="mt-2 mb-3"></input><br />
                    <button onClick={ handleAnswerSubmitted } className="btn btn-success mt-3 mb-3">Submit</button>
                    <div className="mt-2 mb-2 text-danger">{ securityQuestionMessage }</div>
                </div>
            )
        }
        else {
            return (
                <div>
                    <h3 className="mt-2">Login</h3>
                    <hr />
                    <label className="mt-3">Username</label><br />
                    <input onChange={usernameChanged}></input><br />
                    <label className="mt-3">Password</label><br />
                    <input type="password" onChange={passwordChanged}></input><br />
                    <button className="btn btn-outline-success mt-5 mb-4" onClick={loginClicked}>Login</button>
                    <div className="mt-2 mb-2 text-danger">{ loginMessage }</div>
                </div>
            );
        }
    }

    return (
        <div className="row w-100 mt-5">
            <div className="col-md-4"></div>
            <div className="col-md-4 text-center login-form shadow">
                { getLoginOrSecurityQuestions() }
            </div>
        </div>
    )
}

export default Login;
