import { Heading } from "@chakra-ui/react";
import { useContext } from "react";
import AuthCheck from "../../components/AuthCheck";
import Metatags from "../../components/Metatags";
import { UserContext } from "../../lib/context";

const Settings = () => {
    const { username } = useContext(UserContext);

    return (
        <>
            <Metatags title={`Settings - @${username}`} description='Profile settings for the account in Blog' />
            <AuthCheck>
                <Heading>Settings</Heading>

            </AuthCheck>
        </>
    );
}

export default Settings;