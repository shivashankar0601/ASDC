import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../data/Constants";
import { Context, ContextI } from "../data/Context";
import SignInImg from "../images/SignIn.jpg";
import { AuthResponseI } from "../interface/AuthResponseI";

interface SignInProps {}

const SignIn: React.FC<SignInProps> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setUser, setAccessToken } = useContext(Context) as ContextI;

  const handleSubmit = () => {
    if (!email.trim().length) {
      toast.error("email is required");
      return;
    }
    if (password.trim().length < 8) {
      toast.error("password should be mininum of 8 characters");
      return;
    }
    setIsLoading(true);
    axios
      .post<AuthResponseI>(API + "/auth/login", { email, password })
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem(
          "accessToken",
          JSON.stringify(response.data.accessToken)
        );
        localStorage.setItem(
          "refreshToken",
          JSON.stringify(response.data.refreshToken)
        );
        setUser(response.data.user);
        setAccessToken(response.data.accessToken);
        setIsLoading(false);
      })
      .catch((error: AxiosError) => {
        console.log(error);
        toast.error(
          error.isAxiosError
            ? JSON.stringify(error.response?.data?.message)
            : error.message
        );
        setIsLoading(false);
      });
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex w="100vw" minH="100vh" justify="center" align="center">
        <Flex
          w={["100%", "90%", "80%"]}
          h="80vh"
          shadow="lg"
          rounded="2xl"
          flexDirection={["column", "column", "row"]}
        >
          <Flex w="40%" h="100%" display={["none", "none", "flex"]}>
            <Image src={SignInImg} h="100%" w="100%" objectFit="cover" />
          </Flex>
          <Flex
            h="100%"
            w={["100%", "100%", "60%"]}
            px={[2, 2, 0]}
            my={[10, 10, 0]}
            flexDirection="column"
            align="center"
            justify="space-evenly"
          >
            <Flex flexDirection="column">
              <Text fontSize="5xl">Welcome Back</Text>
              <Text color="gray.600">Please enter your details</Text>
            </Flex>

            <FormControl isRequired w={["90%", "90%", "60%"]}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="ferin@dal.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired w={["90%", "90%", "60%"]}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Something secure"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormHelperText>Minimum 8 characters</FormHelperText>
            </FormControl>

            <Button
              bg="#fe5656"
              color="white"
              w={["90%", "90%", "60%"]}
              onClick={handleSubmit}
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Sign In
            </Button>

            <Link to="/signup">
              <Text cursor="pointer" color="gray.600">
                Create an new account!
                <span style={{ color: "#0AF" }}> Sign Up</span>
              </Text>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </motion.div>
  );
};
export default SignIn;
