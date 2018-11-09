import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyB137IjXmMOglqv0LMpfGwQLmEBAWQ0Lps",
    authDomain: "interaxis-10233.firebaseapp.com",
    databaseURL: "https://interaxis-10233.firebaseio.com",
    projectId: "interaxis-10233",
    storageBucket: "interaxis-10233.appspot.com",
    messagingSenderId: "702227993615"
};
firebase.initializeApp(config);
export default firebase;