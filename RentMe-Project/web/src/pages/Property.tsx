import { Button, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SearchNavbar from "../components/SearchNavbar";
import { API } from "../data/Constants";
import { PropertyI } from "../interface/PropertyI";

interface propImage {
  imagePublicId: string;
  imageUrl: string;
}
interface PropertyProps {}

const Property: React.FC<PropertyProps> = () => {
  const params = useParams();
  const [property, setProperty] = useState<PropertyI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<propImage[]>([]);

  useEffect(() => {
    if (!params.id) {
      return;
    }
    setIsLoading(true);
    axios
      .get<PropertyI>(`${API}/properties/${params.id}`)
      .then((response) => {
        setProperty(response.data);
        const data: propImage[] = [
          {
            imagePublicId: response.data.featuredImageId,
            imageUrl: response.data.featuredImage,
          },
        ];
        response.data.propertiesImages.forEach((item) => {
          data.push({
            imagePublicId: item.imagePublicId,
            imageUrl: item.imageUrl,
          });
        });
        setImages([...data]);
      })
      .catch((error: AxiosError) => {
        toast(
          error.isAxiosError
            ? JSON.stringify(error.response?.data)
            : error.message
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params]);

  return (
    <Flex w="100vw" minH="100vh" flexDirection="column">
      <SearchNavbar />

      {isLoading ? (
        <Flex w="100%" h="90vh" justify="center" align="center">
          <Spinner color="red" size="lg" />
        </Flex>
      ) : property ? (
        <Flex w="100%" justify="center" align="center">
          <Flex
            w="90%"
            minH="60vh"
            justify="center"
            align="center"
            position="relative"
            mt="5"
            flexDirection="column"
          >
            <Flex w="100%" h="100%">
              <Carousel
                stopOnHover
                infiniteLoop
                showArrows
                dynamicHeight={false}
                showIndicators
                swipeable
                autoPlay
                renderArrowPrev={(clickHandler: () => void) => (
                  <Flex
                    w="50px"
                    h="50px"
                    rounded="50%"
                    bg="white"
                    justify="center"
                    align="center"
                    position="absolute"
                    top="50%"
                    left="1%"
                    zIndex={20}
                    cursor="pointer"
                    transform="translate(-1%,-50%)"
                    onClick={clickHandler}
                  >
                    <GrFormPrevious />
                  </Flex>
                )}
                renderArrowNext={(clickHandler: () => void) => (
                  <Flex
                    w="50px"
                    h="50px"
                    rounded="50%"
                    bg="white"
                    justify="center"
                    align="center"
                    position="absolute"
                    top="50%"
                    left="99%"
                    zIndex={20}
                    cursor="pointer"
                    transform="translate(-99%,-50%)"
                    onClick={clickHandler}
                  >
                    <GrFormNext />
                  </Flex>
                )}
              >
                {images.map((item, index) => (
                  <Flex h="60vh" w="100%" shadow="md" key={index}>
                    <Image
                      src={
                        item.imageUrl ||
                        `https://source.unsplash.com/featured/?house&${index}`
                      }
                    />
                  </Flex>
                ))}
              </Carousel>
            </Flex>

            <Flex w="100%" shadow="lg" flexDirection="column" mb="10">
              <Flex
                w="100%"
                justify="space-between"
                align="center"
                border="1px"
                borderColor="gray.300"
                p="5"
              >
                <Text fontSize="3xl" fontWeight="semibold">
                  {property.title}
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  ${property.price}
                </Text>
              </Flex>
              <Flex
                w="100%"
                flexDirection="column"
                border="1px"
                borderColor="gray.300"
                p="3"
              >
                <Text fontSize="lg" fontWeight="bold" my="5">
                  Details
                </Text>
                <Text>{property.description}</Text>
                {property.url && (
                  <Button
                    mt="5"
                    w={["100%", "50%", "20%"]}
                    colorScheme="blue"
                    onClick={() => {
                      window.open(property.url, "_blank");
                    }}
                  >
                    Visit Website
                  </Button>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Flex w="100%" h="90vh" justify="center" align="center">
          <Text>No Such Property Exist</Text>
        </Flex>
      )}
    </Flex>
  );
};
export default Property;
