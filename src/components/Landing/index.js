import React, { Fragment } from 'react';
import './landing.css';

const Landing = () => {
    return (
        <div className="landingContainer">
            <h1>Bienvenue !</h1>
            <p>
                Ici vous pourrez vous mesurer aux autres joueurs inscrits sur le site et déterminer qui d'entre vous<br/>
                est le roi du tic-tac-toe !<br/>
                A moins que vous ne préfériez d'abord vous exercer contre l'ordinateur ?<br/>
                Quelque soit votre choix, c'est très simple, il vous suffit de vous connecter ou de vous inscrire dès<br/>
                maintenant !<br/>
                On attend plus que vous !<br/>
            </p>
            <br/>
            <p>
                Infos :<br/>
                Le tic-tac-toe, aussi appelé « morpion » (par analogie au jeu de morpion) et « oxo » en Belgique, <br/>
                est un jeu de réflexion se pratiquant à deux joueurs au tour par tour dont le but est de créer le <br/>
                premier un alignement. Le jeu se joue généralement avec papier et crayon.<br/>
            </p>
        </div>
    )
}

export default Landing
