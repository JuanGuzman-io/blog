import Link from "next/link";
import { useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";

const Navbar = () => {
    const { user, username } = useContext(UserContext);
    const router = useRouter();

    const photoURL = user?.photoURL;

    return (
        <nav className="navbar">
            <ul>
                <Link href={'/'}>
                    <button className="btn-logo">Blog</button>
                </Link>
                {
                    username ? (
                        <>
                            <li className='push-left'>
                                <Link
                                    href={'/signout'}
                                >
                                    <button
                                        className='btn-red'
                                    >Sign Out</button>
                                </Link>
                            </li>
                            <li>
                                <Link href={'/admin'}>
                                    <button
                                        className='btn btn-blue'
                                    >Write Posts</button>
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${username}`}>
                                    {
                                        photoURL ? (
                                            <img src={photoURL} />
                                        ) : (
                                            <img src="/profile.png" />
                                        )
                                    }
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li className="flex">
                            <Link href={'/enter'}>
                                <button className="btn-blue">Log In</button>
                            </Link>
                            <Link href={'/signup'}>
                                <button className="btn-create">Create account</button>
                            </Link>
                        </li>
                    )
                }
            </ul>
        </nav>
    );
}

export default Navbar;