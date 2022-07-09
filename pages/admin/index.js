import { collection, doc, limit, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import AuthCheck from "../../components/AuthCheck";
import { UserContext } from "../../lib/context";
import { auth, db } from "../../lib/firebase";
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from "next/router";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
import Feed from '../../components/Feed';
import Metatags from '../../components/Metatags';
import { Box, Button, Container, Flex, FormControl, Input, Text } from "@chakra-ui/react";

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
    const q = query(ref, orderBy('createdAt', 'desc'));
    const [querySnapshot] = useCollection(q)

    const posts = querySnapshot?.docs.map(doc => doc.data());

    return (
        <>
            <Container
                py={6}
                alignContent={'center'}
            >
                <Text textAlign={'center'} fontWeight={'bold'} fontSize={'4xl'}>Create new post</Text>
                <CreateNewPost />
            </Container>
            {
                posts?.length === 0 ? (
                    <Text textAlign={'center'} fontSize={'xl'}>You don't have any post 😣</Text>
                ) : (
                    <Feed posts={posts} admin />
                )
            }
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
        <Box
            as="form"
            onSubmit={createPost}
            py={'6'}
        >
            <FormControl>
                <Input
                    id='text'
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='New post title here...'
                />
                <Flex
                    justifyContent={'flex-end'}
                >
                    <Button
                        mt={'3'}
                        type="submit"
                        disabled={!isValid}
                        colorScheme={'facebook'}
                    >Create</Button>
                </Flex>
            </FormControl>
        </Box>
    )
}

export default AdminPost;