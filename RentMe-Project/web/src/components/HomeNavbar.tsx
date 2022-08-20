import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import { AiOutlineDown, AiOutlineMenu } from "react-icons/ai";
import { motion } from "framer-motion";
import { APP_NAME } from "../data/Constants";
import { Context, ContextI } from "../data/Context";

interface HomeNavbarProps {}

const LeftVariant = {
  initial: {
    y: -100,
  },
  animate: {
    y: 0,
    transition: {
      duration: 0.5,
      delay: 2,
    },
  },
};

const HomeNavbar: React.FC<HomeNavbarProps> = () => {
  const [isLargerThan600] = useMediaQuery("(max-width: 600px)");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, setUser, setAccessToken } = useContext(Context) as ContextI;

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setAccessToken("");
  };

  return (
    <motion.div variants={LeftVariant} initial="initial" animate="animate">
      <Flex
        as="nav"
        w="100vw"
        h="10vh"
        position="absolute"
        top="0"
        left="0"
        p="5"
        justify="space-between"
        align="center"
        zIndex="5"
      >
        <Link to="/">
          <Heading color="#3f48a7" fontWeight="semibold">
            {APP_NAME}
          </Heading>
        </Link>
        {!isLargerThan600 ? (
          <Flex w="50%" h="100%" justify="space-evenly" align="center">
            <Link to="/discover">
              <Text>Discover</Text>
            </Link>

            <Link to="/help">
              <Text>Help</Text>
            </Link>

            {user ? (
              <Menu>
                <MenuButton
                  variant="outline"
                  as={Button}
                  rightIcon={<AiOutlineDown />}
                >
                  <Text textTransform="capitalize">{user.fullname}</Text>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Link to="/signin">
                <Button variant="outline" rightIcon={<BsArrowRight />}>
                  Sign In
                </Button>
              </Link>
            )}
          </Flex>
        ) : (
          <IconButton
            icon={<AiOutlineMenu />}
            aria-label="Open Menu"
            onClick={onOpen}
          />
        )}

        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Phoenix</DrawerHeader>

            <DrawerBody>
              <Flex
                w="100%"
                h="25%"
                flexDirection="column"
                justify="space-evenly"
              >
                <Link to="/discover">
                  <Text>Discover</Text>
                </Link>

                <Link to="/help">
                  <Text>Help</Text>
                </Link>

                {user ? (
                  <Button variant="outline" rightIcon={<BsArrowRight />}>
                    {user.fullname}
                  </Button>
                ) : (
                  <Link to="/signin">
                    <Button variant="outline" rightIcon={<BsArrowRight />}>
                      Sign In
                    </Button>
                  </Link>
                )}
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </motion.div>
  );
};
export default HomeNavbar;
