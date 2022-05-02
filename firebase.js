import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import "firebase/firestore";

import { FIREBASE_API_KEY } from "@env";
import { FIREBASE_AUTH_DOMAIN } from "@env";
import { FIREBASE_PROJECT_ID } from "@env";
import { FIREBASE_STORAGE_BUCKET } from "@env";
import { FIREBASE_MESSAGING_SENDER_ID } from "@env";
import { FIREBASE_APP_ID } from "@env";
import { FIREBASE_MEASUREMENT_ID } from "@env";

// Initialize Firebase
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();
const db = firebase.firestore();
const database = firebase.database();

export { firebase, storage, db, database };
