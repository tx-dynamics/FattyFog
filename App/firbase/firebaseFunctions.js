import * as firebase from 'firebase'
//import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
export async function signIn(email, password) {
    let success = true;
    // connectFirebase();
    await firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(async user => {
             AsyncStorage.setItem('Token', user.user.uid);
      })
      .catch(function(error) {
        success = false;
        alert(error.code + ': ' + error.message);
      });
    return success;
  }


  