import React, { Fragment, useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../Firebase';
import {FaUserAlt} from 'react-icons/fa';
import './playerList2.css';
import moment from 'moment';

const PlayersList2 = () => {

    //const utilisateursCollection = db.collection("utilisateurs");
    const firebase = useContext(FirebaseContext);
    const [players, setPlayers] = useState([]);

    /*
    useEffect(() => {
        const uId = firebase.auth.currentUser.uid;
        const unsubscribe = uId != null && firebase.db.collection('users').where('id', '!=', uId).onSnapshot(users => {
            const usersData = users.docs.map(userDoc => userDoc.data())
            setPlayers(usersData)
            console.log(uId)
        });

        return () => unsubscribe();
    }, [])
    */

    useEffect(() => {

        firebase.auth.onAuthStateChanged((user) => {
            if(user){
                let uId = user.uid;
                const unsubscribe = uId != null && firebase.db.collection('users').where('id', '!=', uId).onSnapshot(users => {
                    const usersData = users.docs.map(userDoc => userDoc.data())
                    setPlayers(usersData)
                    console.log(uId)
                });
        
                return () => unsubscribe();
            }
        });
    }, [])

    const defier = (challengedId, challengedUsername) => {
        const challengerId = getUserId();
        const challengerUsername = getUserName();
        const formatedDate = moment(Date.now()).format('DD MMM hh:mm a');
        
        firebase.challenge(challengerId+challengedId).set({
            challengerId: challengerId,
            challengedId: challengedId,
            challengerUsername: challengerUsername,
            challengedUsername: challengedUsername,
            date: formatedDate,
            status: 'sent'
        })
        .then(() => {
            console.log(`${challengerUsername} (${challengerId}) défie ${challengedUsername} (${challengedId})`);
        })
        .catch((err) => {
            console.log("Erreur lors de l'envoi du challenge : " + err);
        })
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
        <div className='profilesDisplay'>
            {players.map((player) => (
                <div key={player.id} className='profileBox'>
                    <FaUserAlt className='profilePicture'/>
                    <p>{player.username}</p>
                    <p>Connected : {player.lastCoDate}</p>
                    <button onClick={() => defier(player.id, player.username)}>Defier</button>
                </div>
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
