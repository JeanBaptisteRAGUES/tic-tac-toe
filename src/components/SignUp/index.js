import moment from 'moment';
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import {FirebaseContext} from '../Firebase'

const Signup = (props) => {
    const firebase = useContext(FirebaseContext);

    const data = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    const [loginData, setLoginData] = useState(data);
    const [error, setError] = useState('');

    const handleChange = e => {
        setLoginData({...loginData, [e.target.id]: e.target.value});
    }

    //moment(new Date(), 'DD-MM-YYYY')

    const handleSubmit = e => {
        e.preventDefault();
        const {email, password, username} = loginData;
        firebase.signupUser(email, password)
        .then((authUser) => {
            const formatedDate = moment(Date.now()).format('DD MMM hh:mm a');
            return firebase.user(authUser.user.uid).set({
                id: authUser.user.uid,
                username: username,
                email: email,
                playedMatches: 0,
                wonMatches: 0,
                lastCoDate: formatedDate
            });
        })
        .then(() => {
            setLoginData({...data});
            props.history.push('/profile');
            firebase.auth.currentUser.updateProfile({
                displayName: username
            })
        })
        .catch(error => {
            setError(error);
            setLoginData({...data});
        });
    }

    const {username, email, password, confirmPassword} = loginData;

    const btn = username === '' || email === '' || password === '' || password !== confirmPassword
    ? <button disabled>Inscription</button> : <button>Inscription</button>

    //gestion erreurs
    const errorMsg = error !== '' && <span>{error.message}</span>;

    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftSignup">

                </div>
                <div className="formBoxRight">
                    <div className="formContent">
                        {errorMsg}
                        <h2>Inscription</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input onChange={handleChange} value={username} type="text" id="username" autoComplete="off" required />
                                <label htmlFor="username">Pseudo</label>
                            </div>
                            <div className="inputBox">
                                <input onChange={handleChange} value={email} type="email" id="email" autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="inputBox">
                                <input onChange={handleChange} value={password} type="password" id="password" autoComplete="off" required />
                                <label htmlFor="password">Mot de passe</label>
                            </div>
                            <div className="inputBox">
                                <input onChange={handleChange} value={confirmPassword} type="password" id="confirmPassword" autoComplete="off" required />
                                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                            </div>
                            {btn}
                        </form>
                        <div className="linkContainer">
                            <Link className="simpleLink" to="/login">Déjà inscrit ? Connectez vous</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup
