import React from 'react';
import {RiUserSearchFill, RiUserReceivedFill} from 'react-icons/ri';
import {GiTicTacToe} from 'react-icons/gi';
import { Link } from 'react-router-dom';
import './onlinemenu.css';

const OnlineMenu = () => {
    return (
        <div className="onlineMenuContainer">
            <Link to='/playerslist2'>
                <div className="choiceContainer">
                    <RiUserSearchFill className='icone'/>
                    <p className="playersLink">Trouver d'autres joueurs</p>
                </div>
            </Link>
            <Link to='/challengeslist'>
                <div className="choiceContainer">
                    <RiUserReceivedFill className='icone'/>
                    <p className="playersLink">Afficher les demandes de défis</p>
                </div>
            </Link>
            <Link to='/matcheslist'>
                <div className="choiceContainer">
                    <GiTicTacToe className='icone'/>
                    <p className="playersLink">Commencer ou continuer une partie</p>
                </div>
            </Link>
        </div>
    )
}

export default OnlineMenu;
