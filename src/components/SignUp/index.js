import moment from 'moment';
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
import './signup.css';

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
            props.history.push('/homepage');
            firebase.auth.currentUser.updateProfile({
                displayName: username
            })
            const formatedDate = moment(Date.now()).format('DD MMM hh:mm a');
            firebase.db.collection('matches').add({
                playersIDs: [firebase.auth.currentUser.uid, '0'],
                playerX_id: firebase.auth.currentUser.uid,
                playerO_id: '0',
                playerX_username: username,
                playerO_username: 'Computer',
                date: formatedDate,
                currentPlayer: firebase.auth.currentUser.uid,
                grid: JSON.stringify([['','',''], ['','',''], ['','','']]),
                turn: 0,
                winner: '',
                type: 'pvc'
            })
            .then(() => {
                console.log("Création du match réussie !");
            })
            .catch((err) => {
                console.log("Erreur lors de la création du match : " + err);
            });
        })
        .catch(error => {
            setError(error);
            setLoginData({...data});
        });
    }

    const {username, email, password, confirmPassword} = loginData;

    const btn = username === '' || email === '' || password === '' || password !== confirmPassword
    ? <button disabled className="signupBtn">Inscription</button> : <button className="signupBtn">Inscription</button>

    //gestion erreurs
    const errorMsg = error !== '' && <span>{error.message}</span>;

    return (
        <div className="signupMain">
            <div className="signupBox">
                {errorMsg}
                <h2>Inscription</h2>
                <form onSubmit={handleSubmit} className="signupForm">
                    <div className="inputBox">
                        <label htmlFor="username">Pseudo :</label><br/>
                        <input 
                            onChange={handleChange} 
                            value={username} 
                            type="text" 
                            id="username" 
                            autoComplete="off" 
                            required
                            placeholder="toto31" 
                        />
                    </div>
                    <div className="inputBox">
                        <label htmlFor="email">Email :</label><br/>
                        <input 
                            onChange={handleChange} 
                            value={email} 
                            type="email" 
                            id="email" 
                            autoComplete="off" 
                            required 
                            placeholder="toto@exemple.com"
                        />
                    </div>
                    <div className="inputBox">
                        <label htmlFor="password">Mot de passe :</label><br/>
                        <input 
                            onChange={handleChange} 
                            value={password} 
                            type="password" 
                            id="password" 
                            autoComplete="off" 
                            required 
                            placeholder="6 lettres/chiffres minimum"
                        />
                    </div>
                    <div className="inputBox">
                        <label htmlFor="confirmPassword">Confirmez le mot de passe :</label><br/>
                        <input 
                            onChange={handleChange} 
                            value={confirmPassword} 
                            type="password" 
                            id="confirmPassword" 
                            autoComplete="off" 
                            required 
                            placeholder="Confirmation mot de passe"
                        />
                    </div>
                    {btn}
                </form>
                <Link className="link" to="/login">Déjà inscrit ? Connectez vous</Link>
            </div>
        </div>
    );
}

export default Signup
