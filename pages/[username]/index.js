import { getDocs, limit, orderBy, where, query as q, collection } from "firebase/firestore";
import Metatags from "../../components/Metatags";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";

export async function getServerSideProps({ query }) {
    const { username } = query;
    let ref;
    const userDoc = await getUserWithUsername(username);
    userDoc.forEach(doc => ref = doc.ref);

    let user = null;
    let posts = null;

    if (userDoc) {
        userDoc.forEach(doc => { user = doc.data(); });
        const userRef = collection(ref, 'posts')
        const postQuery = q(
            userRef,
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            limit(5)
        );
        posts = (await getDocs(postQuery)).docs.map(postToJSON);
    }

    return { props: { user, posts } };
}

const UserProfilePage = ({ user, posts }) => {
    return (
        <>
            <Metatags title={`@${user.username}`} description='Profile of the Blog Wep App' />
            <main>
                <UserProfile user={user} />
                <div className="line"></div>
                <PostFeed posts={posts} />
            </main>
        </>
    );
}

export default UserProfilePage;