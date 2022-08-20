import {
  Button,
  Divider,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import AutoCompleteInput from "../components/AutoCompleteInput";
import HomeNavbar from "../components/HomeNavbar";
import HomeSwitch from "../components/HomeSwitch";
import { APP_NAME } from "../data/Constants";
import { Context, ContextI } from "../data/Context";
import HomeImg from "../images/home.jpg";

interface HomeProps {}

const InitVariants = {
  initial: {
    height: "100vh",
  },
  animate: {
    height: 0,
    background: ["#000", "#cdb4db", "#ffc8dd", "#ffafcc", "#bde0fe", "#a2d2ff"],
    transition: {
      duration: 1,
      delay: 1.3,
    },
    transitionEnd: {
      zIndex: -100,
    },
  },
};

const TextVariants = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 0,
    color: ["#fff", "#0d3b66", "#faf0ca", "#f95738"],
    transition: {
      duration: 2,
    },
  },
};

const ImageVariant = {
  initial: {
    y: 500,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      delay: 2.5,
    },
  },
};

const ListGroupVariant = {
  visible: {
    width: "100%",
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3,
      delay: 3,
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

const InitAnimations = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={InitVariants}
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: "0%",
        left: "0%",
        background: "#000",
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <motion.div
        initial="initial"
        animate="animate"
        variants={TextVariants}
        style={{ fontSize: "50px", fontWeight: "bold" }}
      >
        {APP_NAME}
      </motion.div>
    </motion.div>
  );
};

const Home: React.FC<HomeProps> = () => {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState<"tenant" | "landlord">(
    "tenant"
  );

  const {
    houseType,
    setHouseType,
    setPrice,
    price,
    kms,
    setKms,
    setRooms,
    rooms,
  } = useContext(Context) as ContextI;

  return (
    <motion.div exit={{ opacity: 0 }}>
      <Flex minW="100vw" minH="100vh" position="relative">
        <InitAnimations />

        <HomeNavbar />

        <Flex
          w={["100%", "100%", "100%", "80%"]}
          minH="100vh"
          backgroundColor="#f3e8e5"
          align="center"
          p={[2, 5]}
          flexDirection={["column", "column", "column", "row"]}
          justify={[
            "space-evenly",
            "space-evenly",
            "space-evenly",
            "flex-start",
          ]}
        >
          <motion.div
            variants={ListGroupVariant}
            initial="hidden"
            animate="visible"
          >
            <Flex
              flexDirection="column"
              justify="center"
              w="100%"
              marginTop={["24", "24", "24", "0"]}
            >
              <motion.div variants={ListVariant}>
                <HomeSwitch
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                />
              </motion.div>

              {selectedOption === "tenant" ? (
                <>
                  <motion.div variants={ListVariant}>
                    <Text
                      fontSize={["4xl", "4xl", "6xl"]}
                      fontWeight="bold"
                      color="#3f48a7"
                      mt="3"
                    >
                      Find perfect home
                    </Text>
                  </motion.div>

                  <motion.div variants={ListVariant}>
                    <Text
                      fontSize={["4xl", "4xl", "6xl"]}
                      fontWeight="bold"
                      color="#3f48a7"
                    >
                      for yourself.
                    </Text>
                  </motion.div>

                  <motion.div variants={ListVariant}>
                    <Flex
                      w={["100%", "100%", "100%", "70%", "50%"]}
                      bg="white"
                      rounded="md"
                      mt="5"
                      flexDirection="column"
                    >
                      <Flex w="100%" p="2">
                        <AutoCompleteInput />
                        <Divider orientation="vertical" mx="5" />
                        <Button
                          bg="#fe5656"
                          color="white"
                          px="7"
                          onClick={() => navigate("/search")}
                        >
                          Search
                        </Button>
                      </Flex>
                      <Divider />
                      <Flex
                        w="100%"
                        p="1"
                        justify="space-evenly"
                        flexWrap="wrap"
                      >
                        <Menu>
                          <MenuButton
                            bg="gray.100"
                            w={["100%", "24%"]}
                            my="1"
                            as={Button}
                            rightIcon={<BsChevronDown />}
                          >
                            Property
                          </MenuButton>
                          <RadioGroup
                            name="property"
                            value={houseType}
                            onChange={(e) => setHouseType(e)}
                          >
                            <MenuList>
                              <MenuItem>
                                <Radio value="house" colorScheme="red">
                                  House
                                </Radio>
                              </MenuItem>
                              <MenuItem>
                                <Radio value="apartment" colorScheme="red">
                                  Apartment
                                </Radio>
                              </MenuItem>
                              <MenuItem>
                                <Radio value="condo" colorScheme="red">
                                  Condo
                                </Radio>
                              </MenuItem>
                              <MenuItem>
                                <Radio value="studio" colorScheme="red">
                                  Studio
                                </Radio>
                              </MenuItem>
                            </MenuList>
                          </RadioGroup>
                        </Menu>

                        <Menu>
                          <MenuButton
                            w={["100%", "24%"]}
                            my="1"
                            bg="gray.100"
                            as={Button}
                            rightIcon={<BsChevronDown />}
                          >
                            Rooms
                          </MenuButton>
                          <RadioGroup
                            name="size"
                            value={rooms}
                            onChange={(e) => setRooms(e)}
                          >
                            <MenuList>
                              <MenuItem>
                                <Radio value="1" colorScheme="red">
                                  1 BHK
                                </Radio>
                              </MenuItem>
                              <MenuItem>
                                <Radio value="2" colorScheme="red">
                                  2 BHK
                                </Radio>
                              </MenuItem>
                              <MenuItem>
                                <Radio value="3" colorScheme="red">
                                  3 BHK
                                </Radio>
                              </MenuItem>
                              <MenuItem>
                                <Radio value="3+" colorScheme="red">
                                  3+ BHK
                                </Radio>
                              </MenuItem>
                            </MenuList>
                          </RadioGroup>
                        </Menu>

                        <Menu>
                          <MenuButton
                            w={["100%", "24%"]}
                            my="1"
                            bg="gray.100"
                            as={Button}
                            rightIcon={<BsChevronDown />}
                          >
                            Price
                          </MenuButton>
                          <RadioGroup
                            name="price"
                            value={price}
                            onChange={(e) => setPrice(e)}
                          >
                            <MenuList>
                              <MenuItem>
                                <Radio value="0-500" colorScheme="red">
                                  0 - $500
                                </Radio>
                              </MenuItem>
                              <MenuItem>
                                <Radio value="500-1000" colorScheme="red">
                                  Upto $1000
                                </Radio>
                              </MenuItem>
                              <MenuItem>
                                <Radio value="1000-2000" colorScheme="red">
                                  Upto $2000
                                </Radio>
                              </MenuItem>
                              <MenuItem>
                                <Radio
                                  value="2000-2000000000"
                                  colorScheme="red"
                                >
                                  $2000 +
                                </Radio>
                              </MenuItem>
                            </MenuList>
                          </RadioGroup>
                        </Menu>

                        <Menu>
                          <MenuButton
                            w={["100%", "24%"]}
                            my="1"
                            bg="gray.100"
                            as={Button}
                            rightIcon={<BsChevronDown />}
                          >
                            Radius
                          </MenuButton>
                          <RadioGroup
                            name="km"
                            value={kms}
                            onChange={(e) => setKms(e)}
                          >
                            <MenuList>
                              <MenuItem>
                                <Radio value="0-2" colorScheme="red">
                                  0 - 2 KM
                                </Radio>
                              </MenuItem>
                              <MenuItem>
                                <Radio value="2-5" colorScheme="red">
                                  Upto 5KM
                                </Radio>
                              </MenuItem>
                              <MenuItem>
                                <Radio value="5-10" colorScheme="red">
                                  Upto 10KM
                                </Radio>
                              </MenuItem>
                              <MenuItem>
                                <Radio value="10-100" colorScheme="red">
                                  10KM +
                                </Radio>
                              </MenuItem>
                            </MenuList>
                          </RadioGroup>
                        </Menu>
                      </Flex>
                    </Flex>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div variants={ListVariant}>
                    <Text
                      fontSize={["4xl", "4xl", "6xl"]}
                      fontWeight="bold"
                      color="#3f48a7"
                      mt="3"
                    >
                      We got something
                    </Text>
                  </motion.div>

                  <motion.div variants={ListVariant}>
                    <Text
                      fontSize={["4xl", "4xl", "6xl"]}
                      fontWeight="bold"
                      color="#3f48a7"
                    >
                      special for you.
                    </Text>
                  </motion.div>

                  <motion.div variants={ListVariant}>
                    <Button
                      bg="#fe5656"
                      color="white"
                      px="7"
                      mt="5"
                      onClick={() =>
                        window.open("https://admin-asdc.netlify.app/", "_blank")
                      }
                    >
                      Launch Admin Panel
                    </Button>
                  </motion.div>
                </>
              )}
            </Flex>
          </motion.div>

          <Flex
            position={["relative", "relative", "relative", "absolute"]}
            top={["0", "0", "0", "50%"]}
            left={["0", "0", "0", "90%"]}
            transform={[
              "translate(0%,0%)",
              "translate(0%,0%)",
              "translate(0%,0%)",
              "translate(-90%,-50%)",
            ]}
            h={["50%", "50%", "50%", "450px"]}
            w={["100%", "100%", "100%", "350px"]}
            marginTop={[10, 10, 10, 0]}
          >
            <motion.div
              initial="initial"
              animate="animate"
              variants={ImageVariant}
            >
              <Image
                src={HomeImg}
                alt="Home"
                h={["50%", "50%", "50%", "450px"]}
                w={["100%", "100%", "100%", "350px"]}
                objectFit="cover"
              />
            </motion.div>
          </Flex>
        </Flex>

        <Flex
          w={["0%", "0%", "0%", "20%"]}
          minH="100vh"
          position="relative"
          zIndex={-1}
        />
      </Flex>
    </motion.div>
  );
};
export default Home;
