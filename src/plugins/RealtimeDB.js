import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';

firebase.initializeApp({
  apiKey: "AIzaSyDfiPsa9LqGum-CF1ALHugnl7HD_-M4HBE",
  authDomain: "video-chat-fc54d.firebaseapp.com",
  projectId: "video-chat-fc54d",
  databaseURL: "https://video-chat-fc54d-default-rtdb.firebaseio.com/",
});

var rtdb = firebase.database();


Vue.use({
  install(Vue) {
    Vue.prototype.$rtdb = rtdb
    Vue.prototype.$rtdb = rtdb
    Vue.$rtdb = rtdb;
  }
})

/**
 * 
 */
// import firebase from 'firebase/app';
// import 'firebase/firestore';

// const firebaseConfig = {
//     apiKey: "AIzaSyDfiPsa9LqGum-CF1ALHugnl7HD_-M4HBE",
//     authDomain: "video-chat-fc54d.firebaseapp.com",
//     projectId: "video-chat-fc54d",
//     storageBucket: "video-chat-fc54d.appspot.com",
//     messagingSenderId: "865778901891",
//     appId: "1:865778901891:web:ae52cd80e35f889b5e0cb6"
// };

// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
// }

// const firestore = firebase.firestore();

// Vue.use({
//     install(Vue) {
//         Vue.prototype.$firestore = firestore
//         Vue.$firestore = firestore;
//     }
// })

export default (_) => { }