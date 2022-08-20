import { Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context, ContextI } from "../data/Context";
import MyMap from "./Maps";

interface SearchMapViewProps {}

const VariableList = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 100 },
};

const SearchMapView: React.FC<SearchMapViewProps> = () => {
  const navigate = useNavigate();

  const { properties } = useContext(Context) as ContextI;

  if (!properties.length) {
    return (
      <Flex w="100%" h="100%" justify="center" align="center">
        <Heading>0 Listings Found</Heading>
      </Flex>
    );
  }

  return (
    <Flex w="100%" h="80vh">
      <Flex
        display={["none", "none", "none", "flex"]}
        w="40%"
        h="100%"
        flexDirection="column"
        overflowY="scroll"
      >
        {properties.map((item, index) => (
          <motion.div variants={VariableList}>
            <Flex key={index} w="90%" height="250px" shadow="lg" m="3">
              <Flex w="50%" h="100%">
                <Image
                  h="250px"
                  w="100%"
                  src={
                    item.featuredImage ||
                    `https://source.unsplash.com/featured/?house&${index}`
                  }
                  objectFit="cover"
                />
              </Flex>

              <Flex
                w="50%"
                h="100%"
                flexDirection="column"
                p="3"
                justify="space-between"
              >
                <Flex w="100%" align="center">
                  <Text color="#3943ac" textTransform="uppercase" fontSize="sm">
                    apartment
                  </Text>
                  <Text color="#3943ac" mx="5" fontSize="sm">
                    {item.size}m2
                  </Text>
                  <Text color="#3943ac" fontSize="sm">
                    {item.bedrooms} ROOMS
                  </Text>
                </Flex>
                <Text fontSize="2xl" fontWeight="semibold">
                  {item.title}
                </Text>
                <Flex w="100%" justify="space-between" align="center" p="3">
                  <Text>${item.price}</Text>
                  <Button
                    bg="#ffa1a1"
                    color="#ff2b2b"
                    onClick={() => {
                      navigate(`/property/${item.id}`);
                    }}
                  >
                    View Details
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </motion.div>
        ))}
      </Flex>

      <Flex w={["100%", "100%", "100%", "60%"]} h="100%">
        <MyMap
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </Flex>
    </Flex>
  );
};
export default SearchMapView;
