import React, { Fragment, useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../Firebase';

const PlayersList = () => {

    //const utilisateursCollection = db.collection("utilisateurs");
    const firebase = useContext(FirebaseContext);
    const [players, setPlayers] = useState([]);

    const searchPlayers = () => {
        console.log("searchPlayers");
        
        firebase.db.collection('users').orderBy('lastCoDate', 'desc').get()
        .then(users => {
            const users2 = [];
            users.forEach(user => {
                users2.push(user.data());
            });
            setPlayers(users2);          
        })
        .catch((error) => {
            console.log("Error getting users: ", error);
        });
        
    }
    

    const displayPlayers = players.length > 0 && (
        <div>
            {players.map((player) => (
                <p key={player.id}>{player.username}</p>
            ))}
        </div>
    )

    return (
        <div>
            PlayersList :<br/>
            <button onClick={() => searchPlayers()}>Afficher joueurs</button>
            {displayPlayers}
        </div>
    )
}

export default PlayersList;
