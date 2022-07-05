import { collection, collectionGroup, doc, getDoc, getDocs } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db, getUserWithUsername, postToJSON } from "../../lib/firebase";
import style from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent'

export async function getStaticProps({ params }) {
    const { username, slug } = params;
    let ref;
    const userDoc = await getUserWithUsername(username);
    userDoc.forEach(doc => ref = doc.ref);

    debugger;

    let post;
    let path;

    if (userDoc) {
        const postRef = collection(ref, 'posts');
        const docRef = doc(postRef, slug);
        post = postToJSON(await getDoc(docRef));
        path = docRef.path;
    }

    return {
        props: { post, path },
        revalidate: 5000,
    };
}

export async function getStaticPaths() {
    const docRef = collectionGroup(db, 'posts');
    const snapshot = await getDocs(docRef);

    const paths = snapshot.docs.map(doc => {
        const { slug, username } = doc.data();

        return { params: { username, slug } }
    });

    return {
        paths,
        fallback: 'blocking'
    };
};

const UserPost = (props) => {
    const postRef = doc(db, props.path);
    const [realtimePost] = useDocumentData(postRef);

    const post = realtimePost || props.post;
    return (
        <main className={style.container}>
            <section>
                <PostContent post={post} />
            </section>

            <aside className="card">
                <p>
                    <strong>{post.upCount || 0} 🔼</strong>
                </p>
            </aside>
        </main>
    );
}

export default UserPost;