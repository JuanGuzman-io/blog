import { Box, Flex, Avatar, Text } from "@chakra-ui/react";

const UserProfile = ({ user }) => {
    return (
        <Box py={6}>
            <Flex
                justifyContent={'center'}
                alignItems={'flex-start'}
                gap={'15'}
            >
                <Avatar
                    src={user?.photoURL || '/profile.png'}
                    name={user?.displayName}
                    borderRadius='full'
                    size={'lg'}
                />
                <div>
                    <Text fontWeight={'black'} fontSize={'2xl'}>{user?.displayName}</Text>
                    <Text color={'gray.500'}>@{user?.username}</Text>
                </div>
            </Flex>
        </Box>
    );
}

export default UserProfile;