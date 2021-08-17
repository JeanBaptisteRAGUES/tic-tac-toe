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
                    console.log(grid);
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

    const handleClick = (rI, cI) => {
        if(isPlayerTurn(getUserId())){
            if(isCaseValid(rI,cI)){
                const newGrid = grid.slice(0);
                newGrid[rI][cI] = team;
                //setGrid(newGrid); 
                firebase.db.collection('matches').doc(matchid)
                .update(
                    {
                        grid: JSON.stringify(newGrid),
                        turn: match.turn+1,
                        currentPlayer: changePlayer()
                    }
                );
            }else{
                console.log("Cette case est déjà prise !");
            }
        }else{
            console.log("Ce n'est pas à votre tour !");
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

    /*
    if(getUserId() === match.currentPlayer){
                    
                }else{
                    
                }
                */

    const playerTurn = team != '' && (
        <div className='turnMessage'>
            {
                match.currentPlayer === getUserId() ? 
                <p>A vous de jouer !</p>
                :
                <p>A l'adversaire de jouer.</p>
            }
        </div>
    )

    return (
        <div>
            <h1>ID match : {matchid}</h1>
            {displayMatch}
            {playerTurn}
        </div>
    )
}

export default Match
