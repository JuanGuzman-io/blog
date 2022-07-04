import { collection, doc, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import AuthCheck from "../../components/AuthCheck";
import { UserContext } from "../../lib/context";
import { auth, db } from "../../lib/firebase";
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from "next/router";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
import PostFeed from '../../components/PostFeed';
import Metatags from '../../components/Metatags';
import styles from '../../styles/Admin.module.css';

const AdminPost = () => {
    return (
        <>
            <Metatags title='Blog - New post' description='New post page for Blog' />
            <main>
                <AuthCheck>
                    <PostList />
                </AuthCheck>
            </main>
        </>
    );
}

function PostList() {
    const { user } = useContext(UserContext);
    const ref = collection(db, 'users', user.uid, 'posts');
    const q = query(ref, orderBy('createdAt'));
    const [querySnapshot] = useCollection(q)

    const posts = querySnapshot?.docs.map(doc => doc.data());

    return (
        <>
            <section
                className={styles.container_form}
            >
                <h1>New post</h1>
                <CreateNewPost />
            </section>
            <PostFeed posts={posts} admin />
        </>
    )
}

function CreateNewPost() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const slug = encodeURI(kebabCase(title));
    const isValid = title.length > 3 && title.length < 100;

    const createPost = async e => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const authorImage = auth.currentUser.photoURL;
        const ref = doc(db, 'users', uid, 'posts', slug);

        const data = {
            title,
            slug,
            uid,
            username,
            authorImage,
            published: false,
            content: '# hello world!',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            upCount: 0,
        };

        await setDoc(ref, data);

        toast.success('Post created!');
        router.push(`/admin/${slug}`);

    }

    return (
        <form
            onSubmit={createPost}
        >
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Your article name'
                className={styles.input}
            />
            <button type="submit" disabled={!isValid} className={styles.btn_new}>
                Create Post
            </button>
        </form>
    )
}

export default AdminPost;