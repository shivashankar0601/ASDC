import { Flex, Input, Box, List, ListItem } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useUserLocation from "../hooks/useUserLocation";

interface AutoCompleteInputProps {
  border?: string;
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  border = "none",
}) => {
  const {
    address,
    getPlacePredictions,
    isPlacePredictionsLoading,
    placePredictions,
    handleLocationPick,
  } = useUserLocation();

  const [localAddress, setLocalAddress] = useState("");

  useEffect(() => {
    setLocalAddress(address);
  }, [address]);

  return (
    <Flex w="100%" position="relative">
      <Input
        placeholder="Country / Region / City / Postal Code"
        border={border}
        value={localAddress}
        onChange={(e) => {
          setLocalAddress(e.target.value);
          getPlacePredictions({ input: e.target.value });
        }}
      />
      <Box
        position="absolute"
        top="100%"
        maxH="250px"
        overflowY="scroll"
        bg="white"
        shadow="md"
        zIndex={1000}
      >
        <List spacing={5}>
          {!isPlacePredictionsLoading &&
            placePredictions.map((item, index) => {
              return (
                <ListItem
                  padding="5"
                  key={index}
                  cursor="pointer"
                  _hover={{
                    bg: "#f3e8e5",
                  }}
                  onClick={() => handleLocationPick(item.description)}
                >
                  {item.description}
                </ListItem>
              );
            })}
        </List>
      </Box>
    </Flex>
  );
};
export default AutoCompleteInput;
