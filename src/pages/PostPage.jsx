import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts[0];
  const textColor = useColorModeValue("gray.700", "gray.200");
  const dividerColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
      } catch (err) {
        showToast("Error", err.message, "error");
      }
    };
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) {
        return;
      }

      const res = await fetch(`api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (err) {
      showToast("Error", err.message, "error");
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"} h="full">
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;

  return (
    <Box p={4} maxW="600px" mx="auto" borderRadius="lg" boxShadow="lg">
      <Flex mb={4} justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap={3}>
          <Avatar src={user.profilePic} size={"md"} name={user.username} />
          <Box>
            <Text fontSize={"lg"} fontWeight={"bold"} color={textColor}>
              {user.username}
            </Text>
            <Image
              src="/verified.png"
              w="4"
              h={4}
              ml={2}
              display="inline-block"
            />
          </Box>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} color={textColor}>
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && (
            <DeleteIcon
              size={20}
              cursor={"pointer"}
              color="red.500"
              _hover={{ color: "red.600" }}
              onClick={handleDeletePost}
            />
          )}
        </Flex>
      </Flex>

      <Text my={3} fontSize="md" color={textColor}>
        {currentPost.text}
      </Text>

      {currentPost.img && (
        <Box
          mt={4}
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={dividerColor}
          boxShadow="md"
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      <Flex my={4}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} borderColor={dividerColor} />

      {currentPost.replies.length > 0 ? (
        currentPost.replies.map((reply) => (
          <Comment
            key={reply._id}
            reply={reply}
            lastReply={
              reply._id ===
              currentPost.replies[currentPost.replies.length - 1]._id
            }
          />
        ))
      ) : (
        <Text textAlign="center" color="gray.500">
          No comments yet
        </Text>
      )}
    </Box>
  );
};

export default PostPage;
