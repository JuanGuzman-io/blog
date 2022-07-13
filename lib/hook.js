import { auth, db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        let unsubscribe;
        // eslint-disable-next-line
        if (user) {
            const ref = doc(db, 'users', user.uid);
            unsubscribe = onSnapshot(ref, (doc) => {
                setUsername(doc.data()?.username);
            });
        } else {
            setUsername(null);
        }

        return unsubscribe;
    }, [user]);

    return { user, username };
}