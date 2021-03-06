import moment from 'moment';
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
    const [vsComputer, setVsComputer] = useState(false);
    const [computerCanPlay, setComputerCanPlay] = useState(true);

    useEffect(() => {
        firebase.auth.onAuthStateChanged((user) => {
            if(user){
                let uId = user.uid;
                console.log('Match id : ' + matchid);
                const unsubscribe = uId !== null && firebase.db.collection('matches').doc(matchid)
                .onSnapshot(match => {
                    const matchData = match.data();
                    setMatch(matchData);
                    setGrid(JSON.parse(matchData.grid));
                    setTeam(getTeam(matchData, uId));
                    setVsComputer(matchData.type == 'pvc');
                });
        
                return () => unsubscribe();
            }
        });
    }, []);



    const getUserId = () => {
        return firebase.auth.currentUser.uid;
    }

    const getUserName = () => {
        return firebase.auth.currentUser.displayName;
    }

    const getTeam = (mData, playerId) => {
        return mData.playerX_id === playerId ? 'X' : 'O'
    }

    const isPlayerTurn = (playerId) => {
        return playerId === match.currentPlayer;
    }

    const changePlayer = () => {
        //console.log(match.currentPlayer);
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
        victory = victory || (grid[0][0] !== '' && grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2]);
        victory = victory || (grid[1][0] !== '' && grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2]);
        victory = victory || (grid[2][0] !== '' && grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2]);
        victory = victory || (grid[0][0] !== '' && grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0]);
        victory = victory || (grid[0][1] !== '' && grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1]);
        victory = victory || (grid[0][2] !== '' && grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2]);
        victory = victory || (grid[0][0] !== '' && grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]);
        victory = victory || (grid[0][2] !== '' && grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]);
        return victory;
    }

    const incrementPlayersPlayedMatchesCount = () => {
        firebase.db.collection('users').doc(match.playerX_id).update({
            playedMatches: firebase.firestore.FieldValue.increment(1)
        })
        .then(() => {
            console.log("Incr??mentation du nombre de matchs jou??s r??ussie");
        })
        .catch((err) => {
            console.log("Erreur lors de l'incr??mentation du nombre de matchs jou??s : " + err);
        });

        firebase.db.collection('users').doc(match.playerO_id).update({
            playedMatches: firebase.firestore.FieldValue.increment(1)
        })
        .then(() => {
            console.log("Incr??mentation du nombre de matchs jou??s r??ussie");
        })
        .catch((err) => {
            console.log("Erreur lors de l'incr??mentation du nombre de matchs jou??s : " + err);
        });
    }

    const endMatch = (matchId, draw) => {
        console.log("Match termin?? !");
        if(vsComputer){
            const formatedDate = moment(Date.now()).format('DD MMM hh:mm a');
            const winner = draw ? 
                '-1' 
            : 
                match.currentPlayer === '0' ? '0' : getUserId();
            
            console.log("Winner : " + winner);
            console.log("User : " + firebase.auth.currentUser.uid);
            firebase.db.collection('matches').doc(matchid)
            .update(
                {
                    date: formatedDate,
                    currentPlayer: firebase.auth.currentUser.uid,
                    grid: JSON.stringify([['','',''], ['','',''], ['','','']]),
                    turn: 0,
                    winner: winner
                }
            )
            .catch(err => {console.log('Erreur maj match : ' + err)});

            return null;
        }

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
        return match.winner !== '';
    }

    const findCase = (myGrid) => {
        let myArray = [];
        let testGrid = myGrid.slice(0);
        let maxPoints = 0;

        myGrid.forEach((row, rI) => {
            row.forEach((myCase, cI) => {
                if(myCase === ''){
                    if(maxPoints == 0){
                        myArray = [rI, cI];
                        maxPoints = 1;
                    }
                    testGrid[rI][cI] = 'O';
                    if(testVictory(testGrid)){
                        myArray = [rI, cI];
                        maxPoints = 3;
                    }
                    testGrid[rI][cI] = 'X';
                    if(maxPoints < 3 && testVictory(testGrid)){
                        myArray = [rI, cI];
                        maxPoints = 2;
                    }
                    testGrid[rI][cI] = '';
                }
            })
        })

        return myArray;
    }

    const gridFull =(myGrid) => {
        let full = true;

        myGrid.forEach((row, rI) => {
            row.forEach((myCase, cI) => {
                if(myCase === ''){
                    full = full &&  myGrid[rI][cI] !== '';
                }
            })
        })
        if(full) console.log('full !');

        return full;
    }

    const computerPlay = (myGrid) => {
        console.log('Computer plays !');
        setComputerCanPlay(false);
        const newGrid = myGrid.slice(0);
        const [rI, cI] = findCase(newGrid);
        match.currentPlayer = '0';
        setTimeout(function() {updateGrid(rI, cI, 'O')}, 1000);
    }

    const updateGrid = (rI, cI, myTeam) => {
        const newGrid = grid.slice(0);
        newGrid[rI][cI] = myTeam;

        firebase.db.collection('matches').doc(matchid)
        .update(
            {
                grid: JSON.stringify(newGrid),
                turn: match.turn+1,
                currentPlayer: changePlayer()
            }
        )
        .then(
            gridFull(newGrid) ?
                endMatch(matchid, true)
            :
                testVictory(newGrid) ?
                    endMatch(matchid, false)
                :
                    vsComputer && match.currentPlayer !== '0' ? computerPlay(grid) : null
        )
        

        return newGrid;
    }

    const handleClick = (rI, cI) => {

        if(isMatchOver()){
            console.log('La partie est termin??e !');
            return null;
        }

        if(!isPlayerTurn(getUserId())){
            console.log("Ce n'est pas ?? votre tour !");
            return null;
        }

        if(!isCaseValid(rI, cI)){
            console.log("Cette case est d??j?? prise !");
            return null;
        }

        const newGrid = updateGrid(rI, cI, team);
    }

    /*
    const testComputer = vsComputer && match != null && match.currentPlayer == '0' && computerCanPlay && (
        computerPlay(grid)
    )
    */

    const displayMatch = match !== null && (
        <div className='matchDisplay'>
            <div className="matchUsernames">{match.playerX_username} VS {match.playerO_username} : </div>
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

    const playerTurn = team !== '' && match.winner === '' && (
        <div className='turnMessage'>
            {
                match.currentPlayer === getUserId() ? 
                <p>A vous de jouer !</p>
                :
                <p>A l'adversaire de jouer.</p>
            }
        </div>
    )

    const restart = () => {
        firebase.db.collection('matches').doc(matchid)
        .update(
            {
                winner: ''
            }
        )
    }

    const matchOverMsg = match !== null && match.winner !== '' && (
        match.winner === '-1' ?
            <div className="matchBox draw">
                <h1>Egalit?? !</h1>
                {
                    vsComputer ?
                    <button onClick={() => restart()}>Recommencer</button>
                    :
                    null
                }
            </div>
        :
            match.winner === firebase.auth.currentUser.uid ?
            <div className="matchBox win">
                <h1>Gagn?? !</h1>
                {
                    vsComputer ?
                    <button onClick={() => restart()}>Recommencer</button>
                    :
                    null
                }
            </div>
            :
            <div className="matchBox lose">
                <h1>Perdu !</h1>
                {
                    vsComputer ?
                    <button onClick={() => restart()}>Recommencer</button>
                    :
                    null
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
