import React, { Fragment, useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../Firebase';
import {FaUserAlt} from 'react-icons/fa';

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

    const defier = (challengedId, challengedUsername) => {
        const challengerId = getUserId();
        const challengerUsername = getUserName();
        console.log(`${challengerUsername} (${challengerId}) défie ${challengedUsername} (${challengedId})`);
    }
    
    //<button onClick={() => defier(player.id, firebase.auth.currentUser, player.username, getUsername(firebase.auth.currentUser))}>Défier</button>
    
    const tester = () => {
        const uId = firebase.auth.currentUser.uid;
        console.log(uId);

        //const userName = getUsername(uId);
        console.log(firebase.auth.currentUser.displayName);
        console.log(firebase.auth.currentUser.metadata.lastSignInTime);
    }

    const getUserId = () => {
        return firebase.auth.currentUser.uid;
    }

    const getUserName = () => {
        return firebase.auth.currentUser.displayName;
    }

    const displayPlayers = players.length > 0 && (
        <Fragment>
            {players.map((player) => (
                <div key={player.id} className='profileBox'>
                    <FaUserAlt />
                    <p>{player.username}</p>
                    <p>Connected : {player.lastCoDate}</p>
                    <button onClick={() => defier(player.id, player.username)}>Defier</button>
                </div>
            ))}
        </Fragment>
    )

    return (
        <div>
            PlayersList :<br/>
            {displayPlayers}
        </div>
    )
}

export default PlayersList2;
