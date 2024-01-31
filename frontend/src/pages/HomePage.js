import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Signup from "../components/auth/Signup";
import Login from "../components/auth/Login";
import { useHistory, useNavigate } from "react-router-dom";
function HomePage() {

  // const history = useHistory();
const navigate=useNavigate()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chat");
  }, [navigate]);
  return (
    <Container maxW={"xl"} centerContent>
      <Box bg="white" fontSize={"4xl"} p="10px 50px" m="50px" borderRadius={"lg"} fontFamily={"work sans"}>
        Chat-Max
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" >
        <Tabs isFitted >
          <TabList >
            <Tab >Login</Tab>
            <Tab >Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;
