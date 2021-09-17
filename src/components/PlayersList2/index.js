import React, { Fragment, useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../Firebase';
import {FaUserAlt} from 'react-icons/fa';
import './playerList2.css';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

toast.configure();

const PlayersList2 = () => {

    //const utilisateursCollection = db.collection("utilisateurs");
    const firebase = useContext(FirebaseContext);
    const [players, setPlayers] = useState([]);

    useEffect(() => {

        firebase.auth.onAuthStateChanged((user) => {
            if(user){
                let uId = user.uid;
                const unsubscribe = uId != null && firebase.db.collection('users').where('id', '!=', uId).onSnapshot(users => {
                    const usersData = users.docs.map(userDoc => userDoc.data())
                    usersData.forEach(userData => {
                        userData.challenged = false;
                    })
                    setPlayers(usersData)
                    console.log(uId)
                });
        
                return () => unsubscribe();
            }
        });
    }, [])

    const showSuccessMsg = () => {
        toast.success('Invitation envoyée !', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false
        })
    }

    const defier = (challengedId, challengedUsername) => {
        const challengerId = getUserId();
        const challengerUsername = getUserName();
        const formatedDate = moment(Date.now()).format('DD MMM hh:mm a');
        
        firebase.db.collection('challenges').add({
            challengerId: challengerId,
            challengedId: challengedId,
            challengerUsername: challengerUsername,
            challengedUsername: challengedUsername,
            date: formatedDate,
            status: 'sent'
        })
        .then(() => {
            console.log(`${challengerUsername} (${challengerId}) défie ${challengedUsername} (${challengedId})`);
            showSuccessMsg();
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
                    {
                        player.challenged ?
                            <button>Envoyé</button>
                        :
                            <button onClick={() => defier(player.id, player.username)}>Defier</button>
                    }
                </div>
            ))}
        </div>
    )

    return (
        <div className="playersListContainer">
            <div className="titleList">Liste des joueurs :</div>
            {displayPlayers}
        </div>
    )
}

export default PlayersList2;
