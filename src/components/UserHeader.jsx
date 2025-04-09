import {
  Avatar,
  Box,
  Flex,
  Link,
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useToast,
  Button,
  Divider,
} from "@chakra-ui/react";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { Link as RouterLink } from "react-router-dom";
import { useColorModeValue } from "@chakra-ui/react";

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Success.",
        status: "success",
        description: "Profile link copied.",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  return (
    <VStack gap={4} alignItems={"start"} w={"full"} p={4} borderRadius={"md"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text
            fontSize={"2xl"}
            fontWeight={"bold"}
            color={useColorModeValue("gray.800", "white")}
          >
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text
              fontSize={"sm"}
              color={useColorModeValue("gray.600", "gray.400")}
            >
              {user.username}
            </Text>
            <Text
              fontSize={"xs"}
              bg={useColorModeValue("gray.300", "gray.600")}
              color={useColorModeValue("gray.800", "gray.100")}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={user.name}
            src={user.profilePic || "https://bit.ly/broken-link"}
            size={{ base: "md", md: "xl" }}
          />
        </Box>
      </Flex>

      <Text color={useColorModeValue("gray.700", "gray.300")}>{user.bio}</Text>

      <Flex w={"full"} justifyContent={"space-between"}>
        {currentUser?._id === user._id ? (
          <Link as={RouterLink} to="/update">
            <Button size={"sm"} colorScheme={"blue"}>
              Update Profile
            </Button>
          </Link>
        ) : (
          <Button
            size={"sm"}
            onClick={handleFollowUnfollow}
            isLoading={updating}
          >
            {following ? "Unfollow" : "Follow"}
          </Button>
        )}

        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.500"}>{user.followers.length} followers</Text>
          <Box w="1" h="1" bg={"gray.500"} borderRadius={"full"}></Box>

          <Box
            className="icon-container"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            p={2}
            borderRadius="full"
            bg={useColorModeValue("transparent", "transparent")}
            _hover={{
              bg: useColorModeValue("gray.200", "gray.700"),
            }}
          >
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor="pointer" />
              </MenuButton>
              <Portal>
                <MenuList
                  bg={useColorModeValue("white", "gray.800")}
                  color={useColorModeValue("black", "white")}
                  borderRadius="md"
                  boxShadow="lg"
                  border={useColorModeValue(
                    "1px solid gray.200",
                    "1px solid gray.600"
                  )}
                >
                  <MenuItem
                    bg={useColorModeValue("white", "gray.800")}
                    color={useColorModeValue("black", "white")}
                    onClick={copyURL}
                  >
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Divider
        orientation="horizontal"
        borderColor={useColorModeValue("gray.400", "gray.700")}
        w="full"
        my={4}
      />
    </VStack>
  );
};

export default UserHeader;
