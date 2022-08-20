import { Divider, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context, ContextI } from "../data/Context";

interface SearchGridProps {}

const VariableList = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 100 },
};

const SearchGridView: React.FC<SearchGridProps> = () => {
  const navigate = useNavigate();
  const { properties } = useContext(Context) as ContextI;

  if (!properties.length) {
    return (
      <Flex w="100%" h="80vh" justify="center" align="center">
        <Heading>0 Listings Found</Heading>
      </Flex>
    );
  }

  return (
    <Flex w="100%" h="auto" justify="space-evenly" flexWrap="wrap">
      {properties.map((item, index) => (
        <Flex
          key={index}
          w={["90%", "48%", "30%", "23%"]}
          shadow="lg"
          flexDirection="column"
          mx="1"
          my="5"
          rounded="lg"
          overflow="hidden"
          minH="300px"
        >
          <motion.div variants={VariableList}>
            <Flex w="100%" h="250px">
              <Image
                h="100%"
                w="100%"
                src={
                  item.featuredImage ||
                  `https://source.unsplash.com/featured/?house&${index}`
                }
              />
            </Flex>
            <Flex w="100%" p="3" flexDirection="column">
              <Flex w="100%" align="center">
                <Text color="#3943ac" textTransform="uppercase" fontSize="sm">
                  apartment
                </Text>
                <Text color="#3943ac" mx="5" fontSize="sm">
                  {item.size}m2
                </Text>
                <Text color="#3943ac" fontSize="sm">
                  {item.bedrooms} BEDROOMS
                </Text>
              </Flex>
              <Text fontSize="2xl" fontWeight="semibold">
                {item.title}
              </Text>
            </Flex>
            <Divider />
            <Flex w="100%" justify="space-between" align="center" p="3">
              <Text>${item.price}</Text>
              <Text
                color="#fe5656"
                fontWeight="semibold"
                cursor="pointer"
                onClick={() => {
                  navigate(`/property/${item.id}`);
                }}
              >
                View Details
              </Text>
            </Flex>
          </motion.div>
        </Flex>
      ))}
    </Flex>
  );
};
export default SearchGridView;
