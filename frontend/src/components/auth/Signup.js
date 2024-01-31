import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Signup() {
  const toast = useToast();
  const navigate=useNavigate()
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const handleClick=() => {
        setShow((show)=>!show)
    }
    const submitHandler=async () => {
      // setPicLoading(true);
      if (!name || !email || !password ) {
        toast({
          title: "Please Fill all the Feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        // setPicLoading(false);
        return;
      }
      console.log(name, email, password);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "api/user",
          {
            name,
            email,
            password,
          },
          config
        );
        console.log(data);
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        // setPicLoading(false);
        // history.push("/chats");
        navigate("/chat")
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        // setPicLoading(false);
      }
    }

    const postDetails =()=>{

    }
  return (
    <VStack spacing="15px" m="20px 40px">
    <FormControl id="name" isRequired>
      <FormLabel>Name</FormLabel>
      <Input
        value={name}
        type="name"
         placeholder="Enter Your Name"
         onChange={(e) => setName(e.target.value)}
      />
    </FormControl>
    <FormControl id="email" isRequired>
      <FormLabel>Email Address</FormLabel>
      <Input
        value={email}
        type="email"
         placeholder="Enter Your Email Address"
         onChange={(e) => setEmail(e.target.value)}
      />
    </FormControl>
    <FormControl id="password" isRequired>
      <FormLabel>Password</FormLabel>
      <InputGroup size="md">
        <Input
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           type={show ? "text" : "password"}
           placeholder="Enter password"
        />
        <InputRightElement width="4.5rem">
          <Button size="sm" 
          onClick={handleClick}
          >
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
    {/* <FormControl id="pic" isRequired>
      <FormLabel>Upload your Picture</FormLabel>
      <Input
         type="file"
         p={1.5}
         accept="image/*"
         onChange={(e) => postDetails(e.target.files[0])}
      />
    </FormControl> */}
    <Button
      colorScheme="blue"
      width="100%"
      style={{ marginTop: 15 }}
      onClick={submitHandler}
      isLoading={loading}
    >
      Login
    </Button>
   
  </VStack>
  )
}

export default Signup