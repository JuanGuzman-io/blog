import style from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import Metatags from '../../components/Metatags';
import { db, auth, serverTimestamp } from '../../lib/firebase';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';

import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../../lib/context';
import Link from 'next/link';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { Box, Button, Checkbox, Container, Flex, FormControl, FormHelperText, Heading, Input, Stack, StackDivider, Text, Textarea } from '@chakra-ui/react';

const AdminPostEdit = ({ }) => {
    return (
        <AuthCheck>
            <Metatags title='Blog - Edit post' />
            <PostEdit />
        </AuthCheck>
    );
}

const PostEdit = () => {
    const router = useRouter();
    const { slug } = router.query;
    const { user } = useContext(UserContext);

    const [preview, setPreview] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onChange' });


    const postRef = doc(
        db,
        'users',
        auth.currentUser.uid,
        'posts',
        slug
    );
    const [post] = useDocumentData(postRef);

    const updatePost = async ({ content, published }) => {
        await updateDoc(postRef, {
            content,
            published,
            updatedAt: serverTimestamp()
        });

        reset({ content, published });

        toast.success('Post updated successfully!');
    };

    return (
        <Container
            maxW={'container.md'}
        >
            <Box
                borderWidth={'0.0625rem'}
                boxShadow={'sm'}
                borderRadius={'xl'}
                px={'20'}
                py={'15'}
            >
                <Heading fontSize={'5xl'}>{post?.title}</Heading>
                <Text>id: {post?.slug}</Text>
                {/* <PostForm postRef={postRef} defaultValue={post} preview={preview} /> */}
                <Stack
                    as='form'
                    onSubmit={handleSubmit(updatePost)}
                    divider={<StackDivider borderColor='gray.200' />}
                    spacing={'1.5rem'}
                >
                    <Box>
                        {
                            preview && (
                                <ReactMarkdown>{watch('content')}</ReactMarkdown>
                            )
                        }
                    </Box>
                    <Box>
                        {
                            preview ? (
                                null
                            ) : (
                                <>
                                    <FormControl>
                                        <Textarea
                                            name='content'
                                            fontFamily={'monospace'}
                                            placeholder='Write your post content here...'
                                            border={'none'}
                                            height={'40vh'}
                                            resize={'none'}
                                            value={post?.content}
                                            {
                                            ...register('content',
                                                {
                                                    required: { value: true, message: 'This field is requiere' },
                                                    maxLength: { value: 20000, message: 'Content is too long' },
                                                    minLength: { value: 10, message: 'Content is too short' }
                                                })
                                            }
                                        />
                                        {
                                            errors.content && (
                                                <FormHelperText textColor={'red'}>
                                                    {errors.content.message}
                                                </FormHelperText>
                                            )
                                        }
                                    </FormControl>
                                    <FormControl my={'6'}>
                                        <Checkbox
                                            name='published'
                                            {...register('published')}
                                        >Public</Checkbox>
                                    </FormControl>
                                    <Flex
                                        justifyContent={'flex-end'}
                                    >
                                        <Button
                                            type='submit'
                                            my={'6'}
                                            bg={'#000'}
                                            color={'white'}
                                            _hover={{ bg: '#000', textDecoration: 'underline' }}
                                        >Post</Button>
                                    </Flex>
                                </>
                            )
                        }
                    </Box>
                </Stack>
            </Box>
        </Container>
    )
}

const PostForm = ({ postRef, defaultValues, preview }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues, mode: 'onChange' });

    const updatePost = async ({ content, published }) => {
        await updateDoc(postRef, {
            content,
            published,
            updatedAt: serverTimestamp()
        });

        reset({ content, published });

        toast.success('Post updated successfully!');
    };

    return (
        <Stack
            as='form'
            onSubmit={handleSubmit(updatePost)}
            divider={<StackDivider borderColor='gray.200' />}
            spacing={'1.5rem'}
        >
            <Box>
                {
                    preview && (
                        <ReactMarkdown>{watch('content')}</ReactMarkdown>
                    )
                }
            </Box>
            <Box>
                {
                    preview ? (
                        null
                    ) : (
                        <>
                            <FormControl>
                                <Textarea
                                    name='content'
                                    fontFamily={'monospace'}
                                    placeholder='Write your post content here...'
                                    border={'none'}
                                    height={'40vh'}
                                    resize={'none'}
                                    ref={
                                        register('content',
                                            {
                                                required: { value: true, message: 'This field is requiere' },
                                                maxLength: { value: 20000, message: 'Content is too long' },
                                                minLength: { value: 10, message: 'Content is too short' }
                                            })
                                    }
                                />
                                {
                                    errors.content && (
                                        <FormHelperText textColor={'red'}>
                                            {errors.content.message}
                                        </FormHelperText>
                                    )
                                }
                            </FormControl>
                            <FormControl my={'6'}>
                                <Checkbox
                                    name='published'
                                    {...register('published')}
                                >Public</Checkbox>
                            </FormControl>
                            <Flex
                                justifyContent={'flex-end'}
                            >
                                <Button
                                    type='submit'
                                    my={'6'}
                                    bg={'#000'}
                                    color={'white'}
                                    _hover={{ bg: '#000', textDecoration: 'underline' }}
                                >Post</Button>
                            </Flex>
                        </>
                    )
                }
            </Box>
        </Stack>
    )


}

export default AdminPostEdit;