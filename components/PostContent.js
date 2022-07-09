import {
    Box,
    Center,
    Text,
    Stack,
    Avatar,
    useColorModeValue,
    Flex,
    Spacer,
    Button,
} from '@chakra-ui/react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import style from '../styles/Content.module.css'

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
                p={7}
                overflow={'hidden'}
            >
                <Stack mb={6} direction={'row'} spacing={4} align={'center'}>
                    <Link
                        href={`/${post.username}`}
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
                            href={`/${post.username}`}
                        >
                            <a>
                                <Text fontWeight={600}>@{post.username}</Text>
                            </a>
                        </Link>
                        <Text textColor={'gray.500'}>{new Date(createdAt).toDateString()}</Text>
                    </Stack>
                </Stack>
                <Stack>
                    <Flex
                        justifyContent={'space-between'}
                        alignItems={'center'}
                    >
                        <Stack>
                            <h2 className='title-card'>
                                <a>{post.title}</a>
                            </h2>
                            <ReactMarkdown>{post?.content}</ReactMarkdown>
                        </Stack>
                    </Flex>
                </Stack>
            </Box>
        </Center>
    );
}

export default PostContent;