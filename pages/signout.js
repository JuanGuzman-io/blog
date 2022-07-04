import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { auth } from "../lib/firebase";

const SignOut = () => {
    const router = useRouter();

    const signOut = () => {
        auth.signOut();
        toast('See you later!', {
            icon: '🌝',
            style: {
                border: '1px solid #333',
            },
        });
        router.push('/');
    }

    return (
        <main className="center">
            <section>
                <h3>Are you sure you want to sign out?</h3>
                <button
                    onClick={signOut}
                    className='btn-black'
                >Yes, good bye</button>
            </section>
        </main>
    );
}

export default SignOut;