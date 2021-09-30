import * as firebase from 'firebase';
 export async function connectFirebase() {
    //   // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAM5bV7ivb1c88U2bk2ZAwPjYEBDuo0Amo",
        authDomain: "fattyfog-98e3a.firebaseapp.com",
        projectId: "fattyfog-98e3a",
        storageBucket: "fattyfog-98e3a.appspot.com",
        messagingSenderId: "970407420695",
        appId: "1:970407420695:web:2ee78bb306ad15879d0d52",
        measurementId: "G-C40F32TSSS"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
      console.log('Firebase connected ');
    }
  }