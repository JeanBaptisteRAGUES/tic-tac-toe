import React, { Fragment, useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../Firebase';
import moment from 'moment';
import { Link } from 'react-router-dom';
import './history.css';

const History = () => {

    //const utilisateursCollection = db.collection("utilisateurs");
    const firebase = useContext(FirebaseContext);
    const [matches, setMatches] = useState([]);

    useEffect(() => {

        firebase.auth.onAuthStateChanged((user) => {
            if(user){
                let uId = user.uid;
                const unsubscribe = uId != null && firebase.db.collection('matches')
                .where('playersIDs', 'array-contains', uId)
                .where('winner', '!=', '')
                .onSnapshot(matches => {
                    const matchesData = matches.docs.map(matchData => matchData)
                    setMatches(matchesData)
                    console.log("test")
                });
        
                return () => unsubscribe();
            }
        });
    }, [])

    const getUserId = () => {
        return firebase.auth.currentUser.uid;
    }

    const getUserName = () => {
        return firebase.auth.currentUser.displayName;
    }

    const displayMatches = matches.length > 0 && (
        <div className='matchesDisplay'>
            {matches.map((match) => (
                <div key={match.id} className='matchBox'>
                    <h2>{match.data().playerX_username} VS {match.data().playerO_username} : </h2>
                    <p>
                        Match commencé le : {match.data().date}<br/>
                        Joueur O : {match.data().playerO_username}<br/>
                        Joueur X : {match.data().playerX_username}<br/>
                        Résultat : {match.data().winner ==  getUserId() ? 'Gagné !' : `Perdu !`}
                    </p>
                    <Link to={`/match/${match.id}`} className="linkBtn">Voir</Link>
                </div>
            ))}
        </div>
    )

    return (
        <div className="matchesListContainer">
            <div className="titleList">Historique des matchs :</div>
            {displayMatches}
        </div>
    )
}

export default History;

