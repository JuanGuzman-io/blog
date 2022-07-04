import { useState } from 'react';
import { collectionGroup, getDocs, limit, startAfter, where, orderBy } from 'firebase/firestore';
import { db, fromMillis, postToJSON } from '../lib/firebase';
import PostFeed from '../components/PostFeed';
import Loader from '../components/Loader';
import Metatags from '../components/Metatags';

const LIMIT = 1;

export async function getServerSideProps(context) {
  const postQuery = collectionGroup(
    db,
    'posts',
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT)
  );

  const posts = (await getDocs(postQuery)).docs.map(postToJSON);
  console.log(posts);

  return { props: { posts } }
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const query = collectionGroup(
      db,
      'posts',
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts = (await getDocs(query)).docs.map(doc => doc.data());

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
        <h1>
          Feed
        </h1>
        <PostFeed posts={posts} />
        {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}
        <Loader show={loading} />
        {postsEnd && <p>There are no more posts 😣</p>}
      </main>
    </>
  )
}
