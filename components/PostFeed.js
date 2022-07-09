import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/router";

const PostFeed = ({ posts, admin }) => {
    return posts ? posts.map(post => <PostItem post={post} key={post.slug} admin={admin} />) : null;
}

function PostItem({ post, admin = false }) {
    const wordCount = post?.content.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);
    const router = useRouter();

    return (
        <Link
            href={`/${post.username}/${post.slug}`}
        >
            <div className="card">
                <section className="flex">
                    <div className="user">
                        <img src={post.authorImage || '/profile.png'} />
                        <Link
                            href={`/${post.username}`}
                        >
                            <a className="username">@{post.username}</a>
                        </Link>
                    </div>

                    {
                        router.pathname === '/admin' ? (
                            <span>
                                {post.published ? <p className='text-success'>Public</p> : <p className='text-danger'>Unpublished</p>}
                            </span>
                        ) : (
                            <span className="time">Hace {formatDistanceToNowStrict(new Date(post.createdAt), { locale: es })}</span>
                        )
                    }
                </section>
                <h2>
                    <a>{post.title}</a>
                </h2>
                <footer className="flex">
                    <span>
                        {wordCount} words. {minutesToRead} min read
                    </span>
                    <span>🔼 {post.upCount}</span>
                </footer>
                {
                    admin && (
                        <Link
                            href={`/admin/${post.slug}`}
                        >
                            <h1>
                                <button className='btn-blue'>Edit</button>
                            </h1>
                        </Link>
                    )
                }
            </div>
        </Link>
    )
}

export default PostFeed;