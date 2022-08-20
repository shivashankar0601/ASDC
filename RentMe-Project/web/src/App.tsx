import { ChakraProvider, theme } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ContextProvider } from "./data/Context";
import AppRoutes from "./routes";

const App = () => {
  return (
    <ContextProvider>
      <ChakraProvider theme={theme}>
        <AnimatePresence exitBeforeEnter>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AnimatePresence>
        <ToastContainer />
      </ChakraProvider>
    </ContextProvider>
  );
};

export default App;
