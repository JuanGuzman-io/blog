import {
    Box,
    Center,
    Text,
    Stack,
    Avatar,
    useColorModeValue,
    Flex,
    Image,
} from '@chakra-ui/react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

const PostContent = ({ post }) => {
    const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

    return (
        <Center py={4}>

            <Box
                // maxW={'container.md'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.900')}
                rounded={'md'}
                borderWidth={'0.0625rem'}
                shadow={'sm'}
                overflow={'hidden'}
            >
                <Box
                    backgroundImage={`url(${post?.imageURL})`}
                    width={'full'}
                    margin={'0 auto'}
                    height={'30vh'}
                    backgroundSize={'cover'}
                    backgroundPosition={'center center'}
                />
                <Stack mb={6} direction={'row'} spacing={4} align={'center'} px={7} py={4}>
                    <Link
                        href={`/${post?.username}`}
                    >
                        <a>
                            <Avatar
                                src={post?.authorImage || '/profile.png'}
                                name={post?.username}
                            />
                        </a>
                    </Link>
                    <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                        <Link
                            href={`/${post?.username}`}
                        >
                            <a>
                                <Flex
                                    flexDirection={'column'}
                                >
                                    <Text fontWeight={600}>{post.displayName}</Text>
                                    <Text fontWeight={200}>@{post.username}</Text>
                                </Flex>
                            </a>
                        </Link>
                        <Text textColor={'gray.500'}>{new Date(createdAt).toDateString()}</Text>
                    </Stack>
                </Stack>
                <Stack px={7} pb={7}>
                    <Flex
                        justifyContent={'space-between'}
                        alignItems={'center'}
                    >
                        <Stack>
                            <Text
                                fontWeight={'bold'}
                                fontSize={'5xl'}
                            >
                                {post?.title}
                            </Text>
                            <ReactMarkdown>{post?.content}</ReactMarkdown>
                        </Stack>
                    </Flex>
                </Stack>
            </Box>
        </Center>
    );
}

export default PostContent;