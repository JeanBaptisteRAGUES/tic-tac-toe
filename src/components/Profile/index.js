import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';

const Profile = (props) => {
    const firebase = useContext(FirebaseContext);
    const [userSession, setUserSession] = useState(null);
    const [userData, setUserData] = useState({});
    const [disconnected, setDisconnected] = useState(false);

    useEffect(() => {
        if(disconnected){
            console.log("Déconnexion");
            firebase.signoutUser();
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
        <div className="quiz-bg">
            <div className="container">
                {userData.username}<br/>
                {userData.email}<br/>
                <br/><br/>
                Stats :<br/> 
                -Parties jouées : {userData.playedMatches}<br/>
                -Parties gagnées : {userData.wonMatches}<br/>
                <br/><br/>
                <Link to='/playerslist2'>Trouver d'autres joueurs</Link><br/>
                <Link to='/challengeslist'>Afficher les demandes de défis</Link><br/>
                <button>Continuer une partie</button><br/>
                <button onClick={() => disconnect()}>Déconnexion</button>
            </div>
        </div>
    );
}

export default Profile
