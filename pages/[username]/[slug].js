import { collection, collectionGroup, doc, getDoc, getDocs } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db, getUserWithUsername, postToJSON } from "../../lib/firebase";
import PostContent from '../../components/PostContent'
import { Box, Button, Container, Flex } from "@chakra-ui/react";
import Metatags from '../../components/Metatags';
import UpButton from "../../components/UpButton";
import AuthCheck from "../../components/AuthCheck";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../../lib/context";

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
    const { user: currentUser } = useContext(UserContext);
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
                    {/* <Box
                        padding={'1rem'}
                        width={'10%'}
                    >
                        <AuthCheck
                            fallback={
                                <Link href={'/enter'}>
                                    <Button
                                        type='submit'
                                        bg={'#000'}
                                        color={'white'}
                                        _hover={{ bg: '#000', textDecoration: 'underline' }}
                                        mt={'4'}
                                    >Enter to interact</Button>
                                </Link>
                            }
                        >

                            <UpButton postRef={post} />
                        </AuthCheck>
                    </Box> */}
                    <Box
                        width={'100%'}
                    >
                        <PostContent post={post} />
                    </Box>
                </Flex>
                {
                    currentUser?.uid === post.uid && (
                        <Flex
                            justifyContent={'flex-end'}
                        >
                            <Link href={`/admin/${post.slug}`}>
                                <Button
                                    bg={'blue.500'}
                                    color={'white'}
                                    rounded={'xl'}
                                    _hover={{
                                        bg: 'blue.700',
                                    }}
                                    _focus={{
                                        bg: 'blue.700',
                                    }}>
                                    Edit
                                </Button>
                            </Link>
                        </Flex>
                    )
                }
            </Container>
        </>
    );
}

export default UserPost;