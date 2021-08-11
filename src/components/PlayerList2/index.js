import React, { Fragment, useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../Firebase';

const PlayersList2 = () => {

    //const utilisateursCollection = db.collection("utilisateurs");
    const firebase = useContext(FirebaseContext);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const unsubscribe = firebase.db.collection('users').onSnapshot(users => {
            const usersData = users.docs.map(userDoc => userDoc.data())
            setPlayers(usersData)
            console.log(players)
        });

        return () => unsubscribe();
    }, [])
    

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
            {displayPlayers}
        </div>
    )
}

export default PlayersList2;
