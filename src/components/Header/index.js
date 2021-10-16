import React, { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../Firebase';
import {FaUserAlt} from 'react-icons/fa';
import {FiMenu} from 'react-icons/fi';
import './header.css';
import { Link, useHistory } from 'react-router-dom';

const Header = (props) => {
    const [connected, setConnected] = useState(false);
    const [user, setUser] = useState(null);
    const [hide, setHide] = useState(true);
    const firebase = useContext(FirebaseContext);
    const [path, setPath] = useState(window.location.pathname);
    const history = useHistory();

    let landingLink = path != '/' && (
        <Link className="button" to="/">Accueil</Link>
    )

    let signupLink = path != '/signup' && (
        <Link className="button" to="/signup">Inscription</Link>
    )

    let loginLink = path != '/login' && (
        <Link className="button" to="/login">Connexion</Link>
    )
    
    useEffect(() => {
        history.listen((location) => {
            setPath(location.pathname);
            console.log(`You changed the page to : ${location.pathname}`);
        })
    }, [history])

    useEffect(() => {
        if(!connected){
            console.log("Déconnexion");
            firebase.signoutUser();
            history.push('/');
        }
    }, [connected, firebase])

    useEffect(() => {
        firebase.auth.onAuthStateChanged((user) => {
            if(user){
                setConnected(true);
                setUser(user);
            }else{
                setConnected(false);
                setUser(null);
            }
        });
    }, []);

    const handleClick = (e) => {
        const burgerMenu = e.currentTarget;
        console.log(window.location.pathname);
        setHide(!hide);
    }

    const buttons = !connected && (
        <div className="buttons">
            {landingLink}
            {signupLink}
            {loginLink}
        </div>
    )

    const hideFrame = hide && "hide";

    const burgerMenu = !connected && (
        <div className="burgerMenu" onClick={handleClick}>
            <FiMenu className="burgerIcon"/>
            <div className={"linksFrame " + hideFrame}>
                <Link to="/signup" className="noDecoration">Inscription</Link>
                <Link to="/login" className="noDecoration">Connexion</Link>
            </div>
        </div>
    )

    const userBurgerMenu = connected && (
        <div className="burgerMenu" onClick={handleClick}>
            <FiMenu className="burgerIcon"/>
            <div className={"linksFrame " + hideFrame}>
                <Link to="/profile" className="link">Voir profil</Link>
                <div onClick={() => setConnected(false)} className="link">Déconnexion</div>
            </div>
        </div>
    )

    const profile = connected && user != null && (
        <div className="profile">
            <FaUserAlt  className='profilePicture2'/>
            {user.displayName}
            <div className="profileLinks">
                <Link to="/profile" className="link">Profil</Link>
                <div onClick={() => setConnected(false)} className="link">Déconnexion</div>
            </div>
        </div>
    )

    return (
        <div className="header">
            <div className='title'>
                Tic-Tac-Toe
            </div>
            {buttons}
            {burgerMenu}
            {userBurgerMenu}
            {profile}
        </div>
    )
}

export default Header;
