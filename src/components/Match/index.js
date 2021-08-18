import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { FirebaseContext } from '../Firebase';
import './match.css';

const Match = () => {

    const {matchid} = useParams();
    const firebase = useContext(FirebaseContext);
    const [match, setMatch] = useState(null);
    const [grid, setGrid] = useState([]);
    const [team, setTeam] = useState('');

    useEffect(() => {

        firebase.auth.onAuthStateChanged((user) => {
            if(user){
                let uId = user.uid;
                const unsubscribe = uId != null && firebase.db.collection('matches').doc(matchid)
                .onSnapshot(match => {
                    const matchData = match.data();
                    setMatch(matchData);
                    setGrid(JSON.parse(matchData.grid));
                    setTeam(getTeam(matchData, uId));
                });
        
                return () => unsubscribe();
            }
        });
    }, []);

    const getUserId = () => {
        return firebase.auth.currentUser.uid;
    }

    const getTeam = (mData, playerId) => {
        return mData.playerX_id == playerId ? 'X' : 'O'
    }

    const isPlayerTurn = (playerId) => {
        return playerId === match.currentPlayer;
    }

    const changePlayer = () => {
        if(match.currentPlayer === match.playerX_id){
            return match.playerO_id;
        }
        return match.playerX_id;
    }

    const isCaseValid = (rI, cI) => {
        return grid[rI][cI] === '';
    }

    const testVictory = (grid) => {
        let victory = false;
        victory = victory || (grid[0][0] != '' && grid[0][0] == grid[0][1] && grid[0][1] == grid[0][2]);
        victory = victory || (grid[1][0] != '' && grid[1][0] == grid[1][1] && grid[1][1] == grid[1][2]);
        victory = victory || (grid[2][0] != '' && grid[2][0] == grid[2][1] && grid[2][1] == grid[2][2]);
        victory = victory || (grid[0][0] != '' && grid[0][0] == grid[1][0] && grid[1][0] == grid[2][0]);
        victory = victory || (grid[0][1] != '' && grid[0][1] == grid[1][1] && grid[1][1] == grid[2][1]);
        victory = victory || (grid[0][2] != '' && grid[0][2] == grid[1][2] && grid[1][2] == grid[2][2]);
        victory = victory || (grid[0][0] != '' && grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2]);
        victory = victory || (grid[0][2] != '' && grid[0][2] == grid[1][1] && grid[1][1] == grid[2][0]);
        return victory;
    }

    const incrementPlayersPlayedMatchesCount = () => {
        firebase.db.collection('users').doc(match.playerX_id).update({
            playedMatches: firebase.firestore.FieldValue.increment(1)
        })
        .then(() => {
            console.log("Incrémentation du nombre de matchs joués réussie");
        })
        .catch((err) => {
            console.log("Erreur lors de l'incrémentation du nombre de matchs joués : " + err);
        });

        firebase.db.collection('users').doc(match.playerO_id).update({
            playedMatches: firebase.firestore.FieldValue.increment(1)
        })
        .then(() => {
            console.log("Incrémentation du nombre de matchs joués réussie");
        })
        .catch((err) => {
            console.log("Erreur lors de l'incrémentation du nombre de matchs joués : " + err);
        });
    }

    const endMatch = () => {
        firebase.db.collection('matches').doc(matchid)
        .update(
            {
                winner: getUserId()
            }
        )
        .catch(err => {console.log('Erreur maj match : ' + err)}); 

        firebase.db.collection('users').doc(getUserId())
        .update(
            {
                wonMatches: firebase.firestore.FieldValue.increment(1)
            }
        )
        .catch(err => {console.log('Erreur maj utilisateur : ' + err)});

        incrementPlayersPlayedMatchesCount();
    }

    const isMatchOver = () => {
        return match.winner != '';
    }

    const updateGrid = (rI, cI) => {
        const newGrid = grid.slice(0);
        newGrid[rI][cI] = team;

        firebase.db.collection('matches').doc(matchid)
        .update(
            {
                grid: JSON.stringify(newGrid),
                turn: match.turn+1,
                currentPlayer: changePlayer()
            }
        );

        return newGrid;
    }

    const handleClick = (rI, cI) => {

        if(isMatchOver()){
            console.log('La partie est terminée !');
            return null;
        }

        if(!isPlayerTurn(getUserId())){
            console.log("Ce n'est pas à votre tour !");
            return null;
        }

        if(!isCaseValid(rI, cI)){
            console.log("Cette case est déjà prise !");
            return null;
        }

        const newGrid = updateGrid(rI, cI);
        
        if(testVictory(newGrid)){
            endMatch(matchid);
        }
    }

    const displayMatch = match != null && (
        <div className='matchDisplay'>
            <h2>{match.playerX_username} VS {match.playerO_username} : </h2>
            <div className='gridBox'>
            {
                grid.map((row, rowIndex) => (
                    row.map((gCase, colIndex) => (
                        <div key={(rowIndex+1) * (colIndex+1)} className='gridCase' onClick={() => handleClick(rowIndex, colIndex)}>
                            {gCase}
                        </div>
                    ))
                ))
            }
            </div>
        </div>
    )

    const playerTurn = team != '' && match.winner == '' && (
        <div className='turnMessage'>
            {
                match.currentPlayer === getUserId() ? 
                <p>A vous de jouer !</p>
                :
                <p>A l'adversaire de jouer.</p>
            }
        </div>
    )

    const matchOverMsg = match != null && match.winner != '' && (
        <div className="matchOverMsg">
            <h2>Match terminé !</h2>
            {
                match.winner == match.playerX_id ?
                <h3>Vainqueur : {match.playerX_username}</h3>
                :
                <h3>Vainqueur : {match.playerO_username}</h3>
            }
        </div>
    )

    return (
        <div className='matchContainer'>
            {displayMatch}
            {playerTurn}
            {matchOverMsg}
        </div>
    )
}

export default Match
