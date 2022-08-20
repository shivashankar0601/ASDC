import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { BsChevronDown, BsFillLayersFill } from "react-icons/bs";
import { FiMap } from "react-icons/fi";
import { toast } from "react-toastify";
import SearchGridView from "../components/SearchGridView";
import SearchMapView from "../components/SearchMapView";
import SearchNavbar from "../components/SearchNavbar";
import { API } from "../data/Constants";
import { Context, ContextI } from "../data/Context";
import useUserLocation from "../hooks/useUserLocation";
import { PropertyI } from "../interface/PropertyI";

interface SearchProps {}

const ListGroupVariant = {
  visible: {
    width: "100%",
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3,
      delay: 1,
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

const Search: React.FC<SearchProps> = () => {
  const [mapView, setMapView] = useState(false);

  const {
    houseType,
    setHouseType,
    price,
    setPrice,
    kms,
    setKms,
    rooms,
    setRooms,
    setProperties,
  } = useContext(Context) as ContextI;

  const { coords } = useUserLocation();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get<PropertyI[]>(
        `${API}/properties/search?lat=${coords.lat}&lng=${coords.lng}&radius=${kms}&houseType=${houseType}&price=${price}&room=${rooms}`
      )
      .then((response) => {
        setProperties(response.data);
      })
      .catch((error: AxiosError) => {
        toast.error(
          error.isAxiosError
            ? JSON.stringify(error.response?.data)
            : error.message
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [coords.lat, coords.lng, houseType, kms, price, rooms, setProperties]);

  return (
    <motion.div exit={{ opacity: 0 }}>
      <Flex w="100vw" minH="100vh" flexDirection="column">
        <SearchNavbar />
        {isLoading}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Flex w="100%" justify="space-between" align="center" h="10vh" px="5">
            <Flex w="60%" align="center">
              <Text fontSize={["lg", "2xl"]} fontWeight="bold" color="gray.600">
                Rental Spaces
              </Text>
              <Flex
                w="75%"
                display={["none", "none", "flex"]}
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
                        <Radio value="2000-2000000000" colorScheme="red">
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
                  <RadioGroup name="km" value={kms} onChange={(e) => setKms(e)}>
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

            <Flex>
              <ButtonGroup size="lg" isAttached variant="outline">
                <IconButton
                  onClick={() => {
                    setMapView(false);
                  }}
                  borderRadius="10"
                  bg={mapView ? "gray.300" : "#fe5656"}
                  aria-label="Box View"
                  icon={<BsFillLayersFill />}
                />
                <IconButton
                  onClick={() => {
                    setMapView(true);
                  }}
                  borderRadius="10"
                  bg={mapView ? "#fe5656" : "gray.300"}
                  aria-label="Map View"
                  icon={<FiMap />}
                />
              </ButtonGroup>
            </Flex>
          </Flex>
        </motion.div>

        <motion.div
          variants={ListGroupVariant}
          initial="hidden"
          animate="visible"
        >
          {mapView ? <SearchMapView /> : <SearchGridView />}
        </motion.div>
      </Flex>
    </motion.div>
  );
};
export default Search;
