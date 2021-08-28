import React, { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../Firebase';
import {FaUserAlt} from 'react-icons/fa';
import './header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    const [connected, setConnected] = useState(false);
    const [user, setUser] = useState(null);
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        if(!connected){
            console.log("Déconnexion");
            firebase.signoutUser();
        }
    }, [connected, firebase])

    useEffect(() => {
        firebase.auth.onAuthStateChanged((user) => {
            if(user){
                setConnected(true);
                setUser(user);
            }else{
                setConnected(false);
                setUser(null);
            }
        });
    }, []);

    const buttons = !connected && (
        <div className="buttons">
            <Link className="button" to="/signup">Inscription</Link>
            <Link className="button" to="/login">Connexion</Link>
        </div>
    )

    const profile = connected && user != null && (
        <div className="profile">
            <FaUserAlt  className='profilePicture2'/>
            <p>{user.displayName}</p>
            <button onClick={() => setConnected(false)}>Déconnexion</button>
        </div>
    )

    /*
            <div className='title'>
                Tic-Tac-Toe
            </div>
            {buttons}
            {profile}
    */

    /*
            <div className='test2'></div>
            <div className='test3'></div>
    */

    return (
        <div className="header">
            <div className='title'>
                Tic-Tac-Toe
            </div>
            {buttons}
            {profile}
        </div>
    )
}

export default Header;
