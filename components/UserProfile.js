const UserProfile = ({ user }) => {
    return (
        <div className="box-center">
            <img src={user?.photoURL} alt="Profile" className="card-img-center" />
            <p>
                <i>@{user?.username}</i>
            </p>
            <h2>{user?.displayName}</h2>
        </div>
    );
}

export default UserProfile;