import * as firebase from 'firebase'
import 'firebase/firestore';
import uuid from 'uuid';
export async function deleteData(collection, doc) {
  const dbh = firebase.firestore();
  await dbh
    .collection(collection)
    .doc(doc)
    .delete()
    .then(function() {
      async () => {
        console.log('Document successfully deleted');
        return true;
      };
    })
    .catch(function(error) {
      console.error('Error writing document: ', error);
    });
}
export async function saveData(collection, doc, jsonObject) {
  const dbh = firebase.firestore();
  await dbh
    .collection(collection)
    .doc(doc)
    .set(jsonObject, { merge: true })
    .then(function () {
      console.log("Document successfully written!");
      return true;
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
      return false;
    });
}

export function getData(collection, doc, objectKey) {
  const dbh = firebase.firestore();
  if (objectKey === undefined) {
    return dbh
      .collection(collection)
      .doc(doc)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          return doc.data();
        } else {
          return false;
        }
      });
  } else {
    return dbh
      .collection(collection)
      .doc(doc)
      .get()
      .then(function (doc) {
        if (doc.exists && doc.data()[objectKey] != undefined) {
          return doc.data()[objectKey];
        } else {
          return false;
        }
      });
  }
}
export async function getAllOfCollection(collection) {
  const dbh = firebase.firestore();

  let data = [];
  let querySnapshot = await dbh
    .collection(collection)
    .get();

  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      //console.log(doc.data());
      data.push(doc.data());
    } else {
      console.log('No document found!');
    }
  });
  return data;
}
export async function getAllOfCollectionWithMatched(collection, id) {
  const dbh = firebase.firestore();

  let data = [];
  let querySnapshot = await dbh
    .collection(collection).where("MovieId", "==", id)
    .get();

  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      data.push(doc.data());
    } else {
      console.log('No document found!');
    }
  });
  return data;
}

export async function getAllOfCollectionWithChatRequest(collection, id) {
  const dbh = firebase.firestore();

  let data = [];
  let querySnapshot = await dbh
    .collection(collection).where("liker1", "==", id)
    .get();

  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      data.push(doc.data());
    } else {
      console.log('No document found!');
    }
  });
  return data;
}

export async function getAllOfCollectionWithCondition(collection, id) {
  const dbh = firebase.firestore();

  let data = [];
  let querySnapshot = await dbh
    .collection(collection).where("userId", "==", id)
    .get();

  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      //console.log(doc.data());
      data.push(doc.data());
    } else {
      console.log('No document found!');
    }
  });
  return data;
}



export async function saveDataWithoutDocId(collection, jsonObject) {
  const dbh = firebase.firestore();
  let upload = await dbh
    .collection(collection)
    .doc()
    .set(jsonObject);
  return upload;
}
export async function addToArray(collection, doc, array, value) {
  const dbh = firebase.firestore();
  await
    dbh
      .collection(collection)
      .doc(doc)
      .update({
        [array]: firebase.firestore.FieldValue.arrayUnion(value),
      });
}
export async function upDateData(collection, doc, jsonObject) {
  const dbh = firebase.firestore();
  await 
  dbh
    .collection(collection)
    .doc(doc)
    .update(jsonObject)
    .then(async () => {
      console.log('Document successfully written!');
      return true;
    })
    .catch(function(error) {
      console.error('Error writing document: ', error);
    });
}
export async function saveInitialData(collection, userId) {
  const dbh = firebase.firestore();
  await dbh
     .collection(collection)
     .doc(userId)
     .set({userdocc: 'Me'})
     .then(function() {
       // alert("Data saved succesfuly");
     })
     .catch(function(error) {
       alert(error);
     });
 }

 export async function getAllOfCollectionwithSearch(collection, searchVal) {
  const dbh = firebase.firestore();

  let data = [];
  let querySnapshot = await dbh
    .collection(collection).where("name", "==", searchVal) 
    .get();

  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      //console.log(doc.data());
      data.push(doc.data());
    } else {
      console.log('No document found!');
    }
  });
  return data;
}

export async function uploadProductImage(uri) {
  try {
    console.log(uri)
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase.storage().ref().child("images/"+ uri);
    const task = ref.put(blob);
    
    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        () => {},
        err => {
          reject(err);
        },
        async () => {
          const url = await task.snapshot.ref.getDownloadURL();
          resolve(url);
        },
      );
    });
  } catch (err) {
    console.log('uploadImage error: ' + err.message);
  }
}
