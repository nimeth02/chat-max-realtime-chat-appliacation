import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {
  const toast = useToast();
  const navigate=useNavigate()
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const handleClick=() => {
        setShow((show)=>!show)
    }
    const submitHandler=async() => {
        if(!email || !password){
          toast({
            title: "Please Fill all the Feilds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
        try {
          const {data}= await axios.post('api/user/login',{

            email,password
          })
          console.log(data)
          toast({
            title: "Loggedin Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          localStorage.setItem("userInfo", JSON.stringify(data));
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
        }
        
    }
  return (
    <VStack spacing="20px" m="20px 40px">
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

export default Login