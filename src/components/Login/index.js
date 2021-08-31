import moment from 'moment';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
import './login.css';

const Login = (props) => {
    const firebase = useContext(FirebaseContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [btn, setBtn] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if(password.length > 5 && email !== ''){
            setBtn(true);
        }else if (btn === true){
            setBtn(false);
        }
    }, [password, email, btn])

    const handleSubmit = e => {
        e.preventDefault();

        firebase.loginUser(email, password)
        .then(user => {
            setEmail('');
            setPassword('');
            props.history.push('/homepage');

            let formatedDate = moment(Date.now()).format('DD MMM hh:mm a');
            firebase.db.collection('users').doc(user.user.uid).update(
                {
                    lastCoDate: formatedDate
                }
            );
        })
        .catch(error => {
            setError(error);
            setEmail('');
            setPassword('');
        })
    }

    return (
        <div className="loginMain">
            <div className="loginBox">
                {error !== '' && <span>{error.message}</span>}
                <h2>Connexion</h2>
                <form onSubmit={handleSubmit} className="loginForm">
                    <div className="inputBox">
                        <label htmlFor="email">Email :</label><br/>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" autoComplete="off" required placeholder="toto@exemple.com"/>
                    </div>
                    <div className="inputBox">
                        <label htmlFor="password">Mot de passe :</label><br/>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" autoComplete="off" required placeholder="Au moins 6 caractères"/>
                    </div>
                    {btn ? <button className="loginBtn">Connexion</button> : <button disabled className="loginBtn">Connexion</button>}
                </form>
                <Link className="link" to="/signup">Vous n'avez pas de compte ? Inscrivez-vous maintenant</Link>
            </div>
        </div>
    );
}

export default Login
