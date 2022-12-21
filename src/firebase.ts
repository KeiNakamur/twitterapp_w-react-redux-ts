import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBOJXWNKim-RTATU_5DE5qzh4QkKYZ6JaU",
  authDomain: "twitter-app-ts.firebaseapp.com",
  databaseURL: "https://twitter-app-ts.firebaseio.com",
  projectId: "twitter-app-ts",
  storageBucket: "twitter-app-ts.appspot.com",
  messagingSenderId: "894243421932",
  appId: "1:894243421932:web:adb82dcfa1343e56a86fc9",
};
// 上記で記述した設定をもとに下記で初期化する
const firebaseApp = firebase.initializeApp(firebaseConfig);

export const db = firebaseApp.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const provider = new firebase.auth.GoogleAuthProvider();