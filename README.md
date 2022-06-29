# Tic Tac Toe

## Description :
Jeu du tic tac toe où vous pourrez jouer en direct contre d'autres joueurs inscrits ou contre l'ordinateur. Vous pouvez ensuite afficher l'historique de vos parties.<br/>
Site fait en React et déployé sur firebase.<br/>
Base de données utilisant le cloud firestore de firebase.<br/>

## Lien du site :
https://tic-tac-toe-a7780.web.app/

## Utilisation :

### Inscription/Connexion :
Vous pouvez vous inscrire ou vous connecter en cliquant sur les liens "inscription" ou "connexion" dans la barre de menu, en haut à droite.<br/>
Pour l'inscription, une adresse mail est demandée, cependant celle-ci peut être fictive, du moment que la syntaxe est correcte (ex : toto@test.com).<br/>
Deux comptes tests sont aussi directement disponibles pour pouvoir tester l'application et les matchs en ligne : <br/>
Compte 1 :<br/>
-Nom d'utilisateur : test01<br/>
-Mot de passe : 123456<br/>
Compte 2 :<br/>
-Nom d'utilisateur : test02<br/>
-Mot de passe : 123456<br/>

## Défier un autre joueur :
Une fois connecté, cliquez sur "Jouez contre d'autres joueurs en ligne", puis sur "Trouver d'autres joueurs".<br/>
Parmis la liste des joueurs qui s'affiche, choisissez en un et cliquez sur "Défier".<br/>
Vous n'avez plus qu'à attendre que l'autre joueur accepte votre invitation.<br/>

## Accepter le défi d'un autre joueur :
Une fois connecté, cliquez sur "Jouez contre d'autres joueurs en ligne", puis sur "Afficher les demandes de défis".<br/>
Si des joueurs vous ont défié, un message s'affichera et vous pourrez accepter ou refuser l'invitation.<br/>

## Commencer une partie contre un autre joueur :
Une fois que votre invitation a été acceptée, ou que vous avez accepté l'invitation, rendez-vous sur votre profil et cliquez sur "Jouer", puis "Jouez contre d'autres joueurs en ligne" et enfin sur "Commencer ou continuer une partie".<br/>
Le résumé de la partie s'affiche alors dans votre liste de parties actives.<br/>
Si celle-ci est déjà commencée, le bouton "Continuer" s'affiche, sinon c'est le bouton "Commencer" qui s'affiche.<br/>
Vous n'avez plus qu'à cliquer sur ce dernier pour jouer.<br/>

## Commencer une partie contre l'ordinateur :
Rendez-vous sur votre profil et cliquez sur "Jouer", puis "Jouez contre l'ordinateur".<br/>

## Afficher l'historique de vos parties :
Rendez-vous sur votre profil et cliquez sur "Historique".<br/>
Seuls l'historique des matchs contre de vrais joueurs (donc pas l'ordinateur) s'affichera.<br/>

## Technologies utilisées :
### Front-End :
-React<br/>
-React icons<br/>
-React toastify<br/>
-Vanilla CSS

### Déploiement, Authentification :
-Firebase<br/>

### Base de données :
-Cloud Firestore<br/>
