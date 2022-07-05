import { useState } from 'react';
import { collectionGroup, getDocs, limit, startAfter, where, orderBy, query, collection } from 'firebase/firestore';
import { db, fromMillis, postToJSON } from '../lib/firebase';
import PostFeed from '../components/PostFeed';
import Loader from '../components/Loader';
import Metatags from '../components/Metatags';

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

export default function Home(props) {
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
    console.log(newPosts);

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
        <PostFeed posts={posts} />

        <section className='center'>
          {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}
          <Loader show={loading} />
          {postsEnd && <p>There are no more posts 😣</p>}
        </section>
      </main>
    </>
  )
}
