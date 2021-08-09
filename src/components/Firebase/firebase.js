import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

class Firebase{
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.firestore();
    }

    // Inscription
    signupUser = (email, password) => {
        return this.auth.createUserWithEmailAndPassword(email, password);
    }

    // Connexion
    loginUser = (email, password) => {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    // Deconnexion
    signoutUser = () => {
        return this.auth.signOut();
    }

    // Récupérer le mot de passe
    passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

    // Créer un nouveau document dans users avec pour id l'uid généré automatiquement lors de l'authentification via Firebase
    user = (uid) => this.db.doc(`users/${uid}`);
}

export default Firebase