import { collection, collectionGroup, doc, getDoc, getDocs } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db, getUserWithUsername, postToJSON } from "../../lib/firebase";
import PostContent from '../../components/PostContent'
import { Box, Container, Flex, Text } from "@chakra-ui/react";
import { BiUpArrow } from "react-icons/bi";
import Metatags from '../../components/Metatags';

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
        <>
            <Metatags title={`${post?.title} - @${post?.username}`} />
            <Container
                maxW={'100%'}
            >
                <Flex
                    justifyContent={'space-between'}
                    alignItems={'start'}
                    flexWrap={'wrap'}
                >
                    <Box
                        padding={'1rem'}
                        width={'10%'}
                    >
                        <Text
                            display={'flex'}
                            alignItems={'center'}
                        ><BiUpArrow /></Text>
                    </Box>
                    <Box
                        width={'100%'}
                    >
                        <PostContent post={post} />
                    </Box>
                </Flex>
            </Container>
        </>
    );
}

export default UserPost;