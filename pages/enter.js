import { getRedirectResult, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../lib/context";
import { auth, db, facebookAuthProvider, googleAuthProvider, twitterAuthProvider } from "../lib/firebase";

const Enter = ({ }) => {
    const { user, username } = useContext(UserContext);
    const router = useRouter();

    return (
        <main className="center">
            {
                user ?
                    username ?
                        <Redirect />
                        :
                        <UsernameForm />
                    :
                    <div className="flex-c">
                        <h1>Welcome to the Blog community</h1>
                        <div className="btn-container">
                            <SignInGoogle />
                            <SignInTwitter />
                            <SignInFacebook />
                        </div>
                        <h3>Have a password? Continue with your Email</h3>
                        <SignInWithEmail />
                    </div>
            }
        </main>
    );
}

function SignInGoogle() {
    const signInWithGoogle = async () => {
        await signInWithRedirect(auth, googleAuthProvider);
    };

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} alt="Google" /> Sign in with Google
        </button>
    );
}

function SignInTwitter() {
    const signInWithTwitter = async () => {
        await signInWithRedirect(auth, twitterAuthProvider);
        getRedirectResult(auth)
            .then(result => {
                const userRef = result.user;

                if (userRef) {
                    toast('Welcome!')
                }
            }).catch(error => {
                const errorMessage = error.message;
                toast('Something gone wrong!', errorMessage);
                console.log(errorMessage);
            });
    }

    return (
        <button className="btn-twitter" onClick={signInWithTwitter}>
            <img src='/twitter.png' alt="Twitter" /> Sign in with Twitter
        </button>
    )
}

function SignInFacebook() {
    const signInWithFacebook = async () => {
        await signInWithRedirect(auth, facebookAuthProvider);
        getRedirectResult(auth)
            .then(() => {
                toast('Welcome!');
            }).catch(error => {
                const errorMessage = error.message;
                toast('Something gone wrong!', errorMessage);
            });
    }
    return (
        <button className="btn-facebook" onClick={signInWithFacebook}>
            <img src={"/facebook.webp"} alt="Facebook" /> Sign in with Facebook
        </button>
    )
}

function SignInWithEmail() {
    return (
        <div
            className="form-container"
        >
            <form
                noValidate
            >
                <div className="input-container">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" />
                </div>
                <div className="input-container">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" />
                </div>
                <button
                    className="btn-container btn-blue"
                    type="submit"
                >Continue</button>
            </form>
        </div>
    )
}

function Redirect() {
    const router = useRouter();
    const { user, username } = useContext(UserContext);

    useEffect(() => {
        if (user && username) {
            router.push('/');
        }
    }, [user, username]);

    return <p>Redirecting...</p>
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [load, setLoad] = useState(false);

    const { user, username } = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();
        const userDoc = doc(db, 'users', user.uid);
        const usernameDoc = doc(db, 'username', formValue);

        const batch = writeBatch(db);
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();
    }

    const onChange = e => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length <= 3) {
            setFormValue(val);
            setLoad(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoad(true);
            setIsValid(false);
        }
    }

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = doc(db, (`usernames/${username}`));
                const { docSnap } = await getDoc(ref);
                console.log('Query execute');
                setLoad(false);
                setIsValid(!docSnap);
            }
        }, 500),
        []
    );

    return (
        !username && (
            <section>
                <h1>Create username,</h1>
                <p>Please enter a valid username to create an account.</p>
                <form
                    onSubmit={onSubmit}
                    className={'form-username'}
                >
                    <div
                        className='input-container'
                    >
                        <input
                            name='username'
                            placeholder='johndoe123'
                            value={formValue}
                            onChange={onChange}
                        />
                        <ValidationMessage username={formValue} isValid={isValid} load={load} />
                    </div>
                    <button
                        type='submit'
                        className='btn-black'
                        disabled={!isValid}
                    >
                        Choose
                    </button>
                </form>
            </section>
        )
    )
}

function ValidationMessage({ username, isValid, load }) {
    if (load) {
        return <p>Validate...</p>;
    } else if (isValid) {
        return <p className='text-success'>{username} is valid!</p>
    } else if (username && !isValid) {
        return <p className='text-danger'>{username} already has taken or is too short!</p>
    } else {
        return <></>;

    }
}

export default Enter;