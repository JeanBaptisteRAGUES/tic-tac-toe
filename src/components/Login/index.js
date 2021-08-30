import moment from 'moment';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';

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
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxRight">
                    <div className="formContent">
                        {error !== '' && <span>{error.message}</span>}
                        <h2>Connexion</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="inputBox">
                                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" autoComplete="off" required />
                                <label htmlFor="password">Mot de passe</label>
                            </div>
                            {btn ? <button>Connexion</button> : <button disabled>Connexion</button>}
                        </form>
                        <div className="linkContainer">
                            <Link className="simpleLink" to="/signup">Vous n'avez pas de compte ? Inscrivez-vous maintenant</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login
