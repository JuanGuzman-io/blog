import { db, auth } from "../lib/firebase";
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc, writeBatch, increment, collection } from "firebase/firestore";
import { Button } from "@chakra-ui/react";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";

export default function({ postRef }){
    const upRef = collection(db, `%${postRef}/heart/${auth.currentUser.uid}`);
    const [upDoc] = useDocument(upRef);

    const upTouch = async () => {
        const uid = auth.currentUser.uid;
        const batch = writeBatch(db);

        batch.update(postRef, { upCount: increment(1) });
        batch.set(upRef, { uid });

        await batch.commit();
    };

    const upRemove = async () => {
        const batch = writeBatch(db);

        batch.update(postRef, { upCount: increment(-1) });
        batch.delete(upRef);

        await batch.commit();
    };

    return upDoc?.exists ? (
        <Button variant={'ghost'} onClick={upRemove}><BiDownArrow /> Down</Button>
    ) : (
        <Button variant={'ghost'} onClick={upTouch}><BiUpArrow /> Up</Button>
    )
};