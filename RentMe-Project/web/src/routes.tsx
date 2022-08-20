import React, { useContext } from "react";
import {
  Navigate,
  Route,
  Routes as BrowerRoutes,
  useLocation,
} from "react-router-dom";
import FullScreenLoading from "./components/FullScreenLoading";
import { Context, ContextI } from "./data/Context";
import Home from "./pages/Home";
import Property from "./pages/Property";
import Search from "./pages/Search";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

interface RoutesProps {}

const Routes: React.FC<RoutesProps> = () => {
  const location = useLocation();
  const { isGlobalLoading, user, accessToken } = useContext(
    Context
  ) as ContextI;

  if (isGlobalLoading) {
    return <FullScreenLoading />;
  }

  return (
    <BrowerRoutes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/property/:id" element={<Property />} />
      {!user && !accessToken && (
        <>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </>
      )}
      <Route path="*" element={<Navigate to="/" />} />
    </BrowerRoutes>
  );
};
export default Routes;
