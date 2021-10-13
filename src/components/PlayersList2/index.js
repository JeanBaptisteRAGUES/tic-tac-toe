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
    const [playersData, setPlayersData] = useState([]);

    useEffect(() => {
        if(players.length > 0) updateUI2();
    }, [players])

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
    }, []);

    const deepClone = (baseObject) => {
        return JSON.parse(JSON.stringify(baseObject));
    }

    const updateUI = async () => {
        const challenges = await firebase.db.collection("challenges").get();
        let uId = firebase.auth.currentUser.uid;
        console.log("uId : " + uId);
        console.log("Old players : " + JSON.stringify(players));
        let updatePlayers = players;
        let challengesData = challenges.docs.map(challengeDoc => challengeDoc.data());
        //console.log("Challenges : " + JSON.stringify(challengesData));
        const userChallenges =  challengesData.filter(challenge => challenge.challengerId === uId);
        //console.log("User challenges : " + JSON.stringify(userChallenges));
        updatePlayers.forEach((uPlayer, id) => {
            if(userChallenges.some(uC => uC.challengedId === uPlayer.id)){
                uPlayer["challenged"] = true;
                //uPlayer["username"] = "GnomeDu31";
                updatePlayers[id] = uPlayer;
            }else{
                uPlayer["challenged"] = false;
                updatePlayers[id] = uPlayer;
            }
        });
        console.log("Update Players : " + JSON.stringify(updatePlayers));
        setPlayers(updatePlayers);
    }

    const updateUI2 = () => {
        firebase.db.collection("challenges").get()
        .then(challenges => {
            let uId = firebase.auth.currentUser.uid;
            console.log("uId : " + uId);
            console.log("Old players : " + JSON.stringify(players));
            let updatePlayers = deepClone(players);
            let challengesData = challenges.docs.map(challengeDoc => challengeDoc.data());
            //console.log("Challenges : " + JSON.stringify(challengesData));
            const userChallenges =  challengesData.filter(challenge => challenge.challengerId === uId);
            //console.log("User challenges : " + JSON.stringify(userChallenges));
            updatePlayers.forEach((uPlayer, id) => {
                if(userChallenges.some(uC => uC.challengedId === uPlayer.id)){
                    uPlayer["challenged"] = true;
                    //uPlayer["username"] = "GnomeDu31";
                    updatePlayers[id] = uPlayer;
                }else{
                    uPlayer["challenged"] = false;
                    updatePlayers[id] = uPlayer;
                }
            });
            console.log("Update Players : " + JSON.stringify(updatePlayers));
            setPlayersData(updatePlayers);
        })
    }

    /*
    useEffect(() => {
        console.log("Test Update Ui");
        if(players.length > 0){
            console.log("Update Ui");
            firebase.auth.onAuthStateChanged((user) => {
                if(user){
                    console.log("ok");
                    let uId = user.uid;
                    const unsubscribe = uId != null && firebase.db.collection('challenges')
                    .where('challengerId', '==', uId)
                    .where('status', '==', 'sent')
                    .onSnapshot(challenges => {
                        console.log("ok_2");
                        let updatePlayers = deepClone(players);
                        let challengesData = challenges.docs.map(challengeDoc => challengeDoc.data());
                        console.log("Challenges : " + JSON.stringify(challengesData));
                        updatePlayers.forEach((uPlayer, id) => {
                            if(challengesData.some(uC => uC.challengedId === uPlayer.id)){
                                uPlayer["challenged"] = true;
                                //uPlayer["username"] = "GnomeDu31";
                                updatePlayers[id] = uPlayer;
                            }else{
                                uPlayer["challenged"] = false;
                                updatePlayers[id] = uPlayer;
                            }
                        });
                        console.log("Update Players : " + JSON.stringify(updatePlayers));
                        setPlayers(updatePlayers);
                    });
            
                    return () => unsubscribe();
                }
            });
        }
    }, [])
    */
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
            updateUI2();
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

    

    const displayPlayers = playersData.length > 0 && (
        <div className='profilesDisplay'>
            {playersData.map((player) => (
                <div key={player.id} className='profileBox'>
                    <FaUserAlt className='profilePicture'/>
                    <p>{player.username}</p>
                    <p>Connected : {player.lastCoDate}</p>
                    {
                        player["challenged"] === true ?
                            <button>Envoyé</button>
                        :
                            <button onClick={() => defier(player.id, player.username)}>{player["challenged"] === true ? "Défié" : "Défier"}</button>
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
