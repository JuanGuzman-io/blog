const UserProfile = ({ user }) => {
    return (
        <div className='box-center'>
            <img src={user?.photoURL} alt="Profile" className="card-img-center" />
            <div>
                <h2>{user?.displayName}</h2>
                <p>@{user?.username}</p>
            </div>
        </div>
    );
}

export default UserProfile;