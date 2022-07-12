import { getDocs, limit, orderBy, where, query as q, collection } from "firebase/firestore";
import Metatags from "../../components/Metatags";
import Feed from "../../components/Feed";
import UserProfile from "../../components/UserProfile";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";
import { Stack, StackDivider, Text } from "@chakra-ui/react";

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
            <Stack
                maxW={'container.md'}
                margin={'0 auto'}
                divider={<StackDivider borderColor={'gray.300'} />}
            >
                <UserProfile user={user} />
                {
                    posts?.length === 0 ? (
                        <Text textAlign={'center'} fontSize={'xl'}>There are no posts 😣</Text>
                    ) : (
                        <Feed posts={posts} />
                    )
                }
            </Stack>
        </>
    );
}

export default UserProfilePage;