import AuthCheck from "../../components/AuthCheck";
import Metatags from "../../components/Metatags";
import { db, auth, storage } from "../../lib/firebase";
import { doc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

import { useState, useContext, useRef } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../../lib/context";

import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { Box, Button, Checkbox, Code, Container, Flex, FormControl, FormHelperText, Heading, Image, Spinner, Stack, StackDivider, Text, Textarea, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure, Progress, Tooltip, } from "@chakra-ui/react";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { BiCamera } from "react-icons/bi";

const AdminPostEdit = (props) => {
    return (
        <AuthCheck>
            <Metatags title="Blog - Edit post" />
            <PostEdit />
        </AuthCheck>
    );
}

const PostEdit = () => {
    const router = useRouter();
    const { slug } = router.query;
    const { user } = useContext(UserContext);

    const [preview, setPreview] = useState(false);

    const postRef = doc(
        db,
        "users",
        user?.uid,
        "posts",
        slug
    );
    const [post] = useDocumentData(postRef);

    return (
        <Container
            maxW={"container.lg"}
        >
            {
                post &&
                <Box
                    borderWidth={"0.0625rem"}
                    boxShadow={"sm"}
                    borderRadius={"xl"}
                    px={"20"}
                    py={"18"}
                >
                    <Heading fontSize={"5xl"}>{post?.title}</Heading>
                    <Text>id: {post?.slug}</Text>
                    <PostForm postRef={postRef} defaultValues={post} preview={preview} />
                    <Flex
                        justifyContent={"flex-end"}
                    >
                        <DeletePost postRef={postRef} />
                    </Flex>
                </Box>
            }
        </Container>
    )
}

function PostForm({ postRef, defaultValues, preview }) {
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: "onChange" });
    let url = "";

    if (defaultValues?.imageURL) {
        url = defaultValues?.imageURL;
        console.log(url);
    }

    const [upload, setUpload] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imageURL, setImageURL] = useState(url);

    const uploadFile = e => {
        const file = Array.from(e.target.files)[0];
        const extension = file.type.split("/")[1];

        const imageRef = ref(storage, `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
        setUpload(true);

        const uploadTask = uploadBytesResumable(imageRef, file);

        uploadTask.on("state_changed",
            snapshot => {
                const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(pct);
            });

        uploadBytes(imageRef, file)
            .then(snapshot => {
                getDownloadURL(snapshot.ref)
                    .then(url => {
                        setImageURL(url);
                    })
            });
    }

    const updatePost = async ({ content, published }) => {
        await updateDoc(postRef, {
            content,
            published,
            imageURL,
            updatedAt: serverTimestamp()
        });

        toast.success("Post updated successfully!");
    };

    return (
        <Stack
            as="form"
            onSubmit={handleSubmit(updatePost)}
            divider={<StackDivider borderColor="gray.200" />}
            spacing={"1.5rem"}
        >
            <Box>
                {
                    preview && (
                        <ReactMarkdown>{watch("content")}</ReactMarkdown>
                    )
                }
            </Box>
            <Box
                width={"100%"}
            >
                {
                    !upload && !imageURL ? (
                        <>
                            <Tooltip label={"Use a ratio of 100:42 for best results"}>
                                <label
                                    htmlFor="image"
                                    className="custom-file-upload"
                                >
                                    <BiCamera /> Upload image
                                    <input
                                        id="image"
                                        type="file"
                                        onChange={uploadFile}
                                        accept="image/*"
                                    />
                                </label>
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            {
                                !imageURL && (
                                    <>
                                        <Progress value={progress} />
                                    </>
                                )
                            }
                        </>
                    )
                }

                {
                    imageURL && (
                        <Flex
                            alignItems={"center"}
                            gap={4}
                        >
                            <Code>Image uploaded!</Code>
                            <Image
                                src={imageURL}
                                alt={"Image upload"}
                                boxSize="100px"
                                objectFit="cover"
                            />
                        </Flex>
                    )
                }
            </Box>
            <Box>
                <FormControl>
                    <Textarea
                        name="content"
                        fontFamily={"monospace"}
                        placeholder="Write your post content here..."
                        border={"none"}
                        height={"30vh"}
                        resize={"none"}
                        {
                        ...register("content",
                            {
                                required: { value: true, message: "This field is requiere" },
                                maxLength: { value: 20000, message: "Content is too long" },
                                minLength: { value: 10, message: "Content is too short" }
                            })
                        }
                    />
                    {
                        errors.content && (
                            <FormHelperText textColor={"red"}>
                                {errors.content.message}
                            </FormHelperText>
                        )
                    }
                </FormControl>
                <FormControl my={"6"}>
                    <Checkbox
                        name="published"
                        {...register("published")}
                    >Public</Checkbox>
                </FormControl>
                <Flex
                    justifyContent={"flex-end"}
                >
                    <Button
                        type="submit"
                        my={"6"}
                        bg={"#000"}
                        color={"white"}
                        _hover={{ bg: "#000", textDecoration: "underline" }}
                    >Save change</Button>
                </Flex>
            </Box>
        </Stack>
    )


}

function DeletePost({ postRef }) {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    const handleDelete = async () => {
        await deleteDoc(postRef);
        router.push("/");
        toast("Eliminada correctamente", { icon: "🗑️" });
    }

    return (
        <>
            <Button colorScheme="red" onClick={onOpen}>
                Delete post
            </Button>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete post
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can"t undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default AdminPostEdit;