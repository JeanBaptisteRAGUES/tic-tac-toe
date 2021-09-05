import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import './profile.css';

const Profile = (props) => {
    const firebase = useContext(FirebaseContext);
    const [userSession, setUserSession] = useState(null);
    const [userData, setUserData] = useState({});
    const [disconnected, setDisconnected] = useState(false);

    useEffect(() => {
        if(disconnected){
            console.log("Déconnexion");
            firebase.signoutUser();
            props.history.push('/');
        }
    }, [disconnected, firebase])

    const disconnect = () => {
        setDisconnected(true);
    }

    useEffect(() => {

        let listener = firebase.auth.onAuthStateChanged(user => {
            user ? setUserSession(user) : props.history.push('/');
        })

        if(userSession !== null){
            firebase.user(userSession.uid)
            .get()
            .then((doc) => {
                if(doc && doc.exists){
                    const myData = doc.data();
                    setUserData(myData);
                }
            })
            .catch(error => {
                console.log(error);
            })
        }

        return () => {
            //Arrête le listener
            listener();
        };
    }, [userSession])

    return userSession === null ? (
        <p>Authentification..</p>
    ) : (
        <div className="profileContainer">
            <div className="userBox">
                <div>{userData.username}</div>
                <div>{userData.email}</div>
                <br/>
                Stats :<br/> 
                -Parties jouées : {userData.playedMatches}<br/>
                -Parties gagnées : {userData.wonMatches}<br/>
                <br/><br/>
                <Link to='/history' className="linkBtn">Historique</Link><br/>
                <Link to='/homepage' className="linkBtn">Jouer</Link><br/>
                <div onClick={() => disconnect()} className="linkBtn">Déconnexion</div>
            </div>
        </div>
    );
}

export default Profile
