import React, { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../Firebase';
import {FaRobot} from 'react-icons/fa';
import {FaUsers} from 'react-icons/fa';
import './homepage.css';
import { Link } from 'react-router-dom';

const HomePage = () => {

    const firebase = useContext(FirebaseContext);
    const [matchId, setMatchId] = useState('');

    useEffect(() => {

        firebase.auth.onAuthStateChanged((user) => {
            if(user){
                let uId = user.uid;
                const unsubscribe = uId != null && firebase.db.collection('matches')
                .where('playersIDs', 'array-contains', uId)
                .where('type', '==', 'pvc')
                .onSnapshot(matches => {
                    const id = matches.docs.map(data => data.id);
                    setMatchId(id[0]);
                    console.log(id[0]);
                });
        
                return () => unsubscribe();
            }
        });
    }, [])

    const displayOnline = (
        <div className="choiceContainer">
            <FaUsers className='icone'/>
            <p>Jouez contre d'autres joueurs en ligne</p>
        </div>
    )

    const displayComputer = matchId != '' && matchId != null && (
        <Link to={`/match/${matchId}`}>
            <div className="choiceContainer">
                <FaRobot className='icone'/>
                <p>Jouez contre l'ordinateur</p>
            </div>
        </Link>
    )

    return (
        <div className="homeContainer">
            {displayOnline}
            {displayComputer}
        </div>
    )
}

export default HomePage
