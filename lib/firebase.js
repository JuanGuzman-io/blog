import { initializeApp } from 'firebase/app';
import { FacebookAuthProvider, getAuth, GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, limit, Timestamp, FieldValue  } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCNaC-NV1TLnG6OEf4o-kD1bK5V3rfAbuQ",
    authDomain: "blog-26d84.firebaseapp.com",
    projectId: "blog-26d84",
    storageBucket: "blog-26d84.appspot.com",
    messagingSenderId: "937710698264",
    appId: "1:937710698264:web:c19ad9599513c27513286d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const facebookAuthProvider = new FacebookAuthProvider();
export const twitterAuthProvider = new TwitterAuthProvider();

export const db = getFirestore(app);
export const fromMillis = Timestamp.fromMillis;
export const serverTimestamp = FieldValue.serverTimestamp;

export const storage = getStorage(app);

// Fucntions
export async function getUserWithUsername(username) {
    const userRef = collection(db, 'users');
    const q = query(userRef, where('username', '==', username), limit(1));
    const userDoc = await getDocs(q);
    return userDoc;
}

export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
    };
}