import { Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "../data/Constants";
import AutoCompleteInput from "./AutoCompleteInput";

interface SearchNavbarProps {}

const ListGroupVariant = {
  visible: {
    width: "100%",
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3,
    },
  },
  hidden: {
    opacity: 0,
    width: "100%",
    transition: {
      when: "afterChildren",
    },
  },
};

const ListVariant = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -100 },
};

const SearchNavbar: React.FC<SearchNavbarProps> = () => {
  return (
    <motion.div variants={ListGroupVariant} initial="hidden" animate="visible">
      <Flex
        w="100vw"
        h="10vh"
        shadow="md"
        justify="space-between"
        align="center"
        p="3"
      >
        <Flex
          w={["90%", "80%", "75%", "50%"]}
          justify="space-evenly"
          align="center"
        >
          <motion.div variants={ListVariant}>
            <Link to="/">
              <Text
                fontSize="2xl"
                w="auto"
                display={["none", "block"]}
                color="#fe5656"
                fontWeight="bold"
              >
                {APP_NAME}
              </Text>
            </Link>
          </motion.div>
          <Flex w="60%" mx="1">
            <motion.div variants={ListVariant} style={{ width: "100%" }}>
              <AutoCompleteInput border="2px solid #f3e8e5" />
            </motion.div>
          </Flex>
        </Flex>
        {/* <Flex>
          <IconButton icon={<AiOutlineMenu />} aria-label="menu" />
        </Flex> */}
      </Flex>
    </motion.div>
  );
};
export default SearchNavbar;
