import React, { Fragment, useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../Firebase';
import moment from 'moment';
import './challengeslist.css';

const ChallengesList = () => {

    //const utilisateursCollection = db.collection("utilisateurs");
    const firebase = useContext(FirebaseContext);
    const [challenges, setChallenges] = useState([]);

    useEffect(() => {

        firebase.auth.onAuthStateChanged((user) => {
            if(user){
                let uId = user.uid;
                const unsubscribe = uId != null && firebase.db.collection('challenges')
                .where('challengedId', '==', uId)
                .where('status', '==', 'sent')
                .onSnapshot(challenges => {
                    const challengesData = challenges.docs.map(challengeData => challengeData);
                    setChallenges(challengesData)
                    console.log(uId)
                });
        
                return () => unsubscribe();
            }
        });
    }, [])

    const acceptOrDecline = (challengeId, challengerId, challengerUsername, answer) => {
        const challengedId = getUserId();
        const challengedUsername = getUserName();
        const formatedDate = moment(Date.now()).format('DD MMM hh:mm a');
        
        if(answer === 'accepted'){
            console.log("Challenge accepté : création d'une nouvelle partie.");
            firebase.db.collection('matches').add({
                playersIDs: [challengerId, challengedId],
                playerX_id: challengerId,
                playerO_id: challengedId,
                playerX_username: challengerUsername,
                playerO_username: challengedUsername,
                date: formatedDate,
                currentPlayer: challengerId,
                grid: JSON.stringify([['','',''], ['','',''], ['','','']]),
                turn: 0,
                winner: '',
                type: 'pvp'
            })
            .then(() => {
                console.log("Création du match réussie !");
            })
            .catch((err) => {
                console.log("Erreur lors de la création du match : " + err);
            });

            firebase.db.collection('challenges').doc(challengeId).update({
                status: 'accepted' 
            })
            .then(() => {
                console.log("MAJ challenge réussie.");
            })
            .catch((err) => {
                console.log("Erreur lors de la MAJ du challenge : " + err);
            });

            
        }else{
            console.log("Challenge refusé !");
            firebase.db.collection('challenges').doc(challengeId).update({
                status: 'declined' 
            })
            .then(() => {
                console.log("MAJ challenge réussie.");
            })
            .catch((err) => {
                console.log("Erreur lors de la MAJ du challenge : " + err);
            });
        }
    }
    

    const getUserId = () => {
        return firebase.auth.currentUser.uid;
    }

    const getUserName = () => {
        return firebase.auth.currentUser.displayName;
    }

    const displayChallenges = challenges.length > 0 && (
        <div className='challengesDisplay'>
            {challenges.map((challenge) => (
                <div key={challenge.id} className='challengeBox'>
                    <p>
                        {challenge.data().date} : <br/>
                        {challenge.data().challengerUsername} veut jouer contre vous !
                    </p>
                    <div className='acceptDeclineBtnBox'>
                        <div onClick={() => acceptOrDecline(challenge.id, challenge.data().challengerId, challenge.data().challengerUsername, 'accepted')} className="acceptDeclineBtn">Accepter</div>
                        <div onClick={() => acceptOrDecline(challenge.id, challenge.data().challengerId, challenge.data().challengerUsername, 'declined')} className="acceptDeclineBtn">Refuser</div>
                    </div>
                </div>
            ))}
        </div>
    )

    const noChallengesMessage = challenges.length == 0 && (
        <div className="noChallengesMessage">
            Aucun joueur ne vous a défié pour le moment.
        </div>
    )

    return (
        <div className="challengesContainer">
            <div className="titleList">Demandes de défis :</div>
            {noChallengesMessage}
            {displayChallenges}
        </div>
    )
}

export default ChallengesList;

