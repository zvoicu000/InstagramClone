import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


const config = {
  
  apiKey: "AIzaSyDTqRObtZavvr15uwFk8rcpgHBV2b6d9H8",
  authDomain: "instagram-c4cf5.firebaseapp.com",
  projectId: "instagram-c4cf5",
  storageBucket: "instagram-c4cf5.appspot.com",
  messagingSenderId: "928865895791",
  appId: "1:928865895791:web:9674fbac2fc692704f949a"
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;



export { firebase, FieldValue };
