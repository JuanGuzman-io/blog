import { collection, collectionGroup, doc, getDoc, getDocs } from "firebase/firestore";
import { db, getUserWithUsername, postToJSON } from "../../lib/firebase";
import style from '../../styles/Post.module.css'

export async function getStaticProps({ params }) {
    const { username, slug } = params;
    let ref;
    const userDoc = await getUserWithUsername(username);
    userDoc.forEach(doc => doc.ref);
    console.log(ref);

    debugger;

    let post;
    let path;

    if (userDoc) {
        const postRef = collection(ref, 'posts');
        post = postToJSON(await getDoc(postRef));
        path = postRef.path;
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
            <h1>User Post</h1>
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