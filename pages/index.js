import { useState } from 'react';
import { collectionGroup, getDocs, limit, startAfter, where, orderBy, query } from 'firebase/firestore';
import { db, fromMillis, postToJSON } from '../lib/firebase';
import Feed from '../components/Feed';
import Metatags from '../components/Metatags';
import { Button, Spinner, Stack, Text } from '@chakra-ui/react';

const LIMIT = 10;

export async function getServerSideProps(context) {
  const postRef = collectionGroup(db, 'posts');
  const q = query(
    postRef,
    orderBy('createdAt', 'desc'),
    where('published', '==', true),
    limit(LIMIT)
  );

  const posts = (await getDocs(q)).docs.map(postToJSON);

  return { props: { posts } }
}

const Home = props => {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const postRef = collectionGroup(db, 'posts');
    const q = query(
      postRef,
      orderBy('createdAt', 'desc'),
      where('published', '==', true),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts = (await getDocs(q)).docs.map(doc => doc.data())

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  }

  return (
    <>
      <Metatags
        title='Blog - Feed'
        description='Feed, all pots from blog community'
      />
      <main>
        <Feed posts={posts} />

        <Stack align={'center'} py={'6'}>
          {
            !loading && !postsEnd &&
            <Button
              colorScheme='blue'
              onClick={getMorePosts}
            >
              Load more
            </Button>
          }
          {loading && <Spinner />}
          {postsEnd && <Text color={'gray.700'} fontSize={'lg'}>There are no more posts 😣</Text>}
        </Stack>
      </main>
    </>
  )
}

export default Home;