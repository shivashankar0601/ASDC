import { Flex, Text } from "@chakra-ui/react";
import React from "react";

interface HomeSwitchProps {
  selectedOption: "tenant" | "landlord";
  setSelectedOption: React.Dispatch<
    React.SetStateAction<"tenant" | "landlord">
  >;
}

const HomeSwitch: React.FC<HomeSwitchProps> = ({
  selectedOption,
  setSelectedOption,
}) => {
  return (
    <Flex
      w="250px"
      background="#FFF"
      rounded="3xl"
      px="1"
      py="1"
      justify="space-between"
      align="center"
    >
      <Flex
        w="50%"
        h="100%"
        justify="center"
        rounded="3xl"
        py="1"
        cursor="pointer"
        bg={selectedOption === "tenant" ? "#3f48a7" : "white"}
        color={selectedOption === "tenant" ? "white" : "black"}
        onClick={() => setSelectedOption("tenant")}
      >
        <Text>Tenant</Text>
      </Flex>
      <Flex
        w="50%"
        h="100%"
        justify="center"
        rounded="3xl"
        py="1"
        cursor="pointer"
        bg={selectedOption === "landlord" ? "#3f48a7" : "white"}
        color={selectedOption === "landlord" ? "white" : "black"}
        onClick={() => setSelectedOption("landlord")}
      >
        <Text>Landlord</Text>
      </Flex>
    </Flex>
  );
};
export default HomeSwitch;
