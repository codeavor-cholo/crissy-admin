import VueFirestore from 'vue-firestore'
import firebase from 'firebase'
require('firebase/firestore')
  
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyB-k6H1-2dWz9dhA90gDW5IqMu_1_tYBDU",
    authDomain: "itsgando-bc658.firebaseapp.com",
    databaseURL: "https://itsgando-bc658.firebaseio.com",
    projectId: "itsgando-bc658",
    storageBucket: "itsgando-bc658.appspot.com",
    messagingSenderId: "811308385521",
    appId: "1:811308385521:web:c349ace5257c8d48ab9550",
    measurementId: "G-1BTCX9YGNW"
  };

  export var firebase2 = firebase.initializeApp(firebaseConfig, 'firebase')
  export var AUTH = firebase2.auth()
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // "async" is optional
  export default async ({ Vue }) => {
    // something to do
    Vue.prototype.$firebase = firebase2
    Vue.prototype.$firestoreApp = firebase2.firestore()
    Vue.prototype.$auth = AUTH
    Vue.use(VueFirestore)
    Vue.use(firebase)
  }