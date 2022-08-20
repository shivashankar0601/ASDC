import { Flex, Spinner } from "@chakra-ui/react";
import React from "react";

interface FullScreenLoadingProps {}

const FullScreenLoading: React.FC<FullScreenLoadingProps> = () => {
  return (
    <Flex h="100vh" w="100vw" justify="center" align="center">
      <Spinner size="xl" />
    </Flex>
  );
};
export default FullScreenLoading;
