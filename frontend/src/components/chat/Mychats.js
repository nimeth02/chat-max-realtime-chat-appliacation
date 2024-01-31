import { Box, Button, Flex, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/chatContext';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import GroupChatModal from './components/CreateGroupChatModal';
import { AddIcon } from '@chakra-ui/icons';

function Mychats({fetchAgain}) {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState(null);
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      console.log(data)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Flex
        pb={3}
        px={3}
        fontSize={{ base: "24px", md: "24px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "16px", md: "10px", lg: "16px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Flex>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        mt="15px"
        borderRadius="lg"
        overflowY="hidden"
    
      >
        {chats ? (
          <Stack overflowY="scroll" >
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                
                  {!chat.isGroupChat
                    ?  chat.users[0]?._id === loggedUser?._id ? chat.users[1].name : chat.users[0].name
                    : chat.chatName}
                </Text>
                {chat.isGroupChat && chat.latestMessage && (
                  <Text fontSize="xs" color="gray">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 20
                      ? chat.latestMessage.content.substring(0, 21) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
                <Text fontSize="xs" color="gray">{!chat.isGroupChat &&  chat.latestMessage?.content}</Text>
                
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default Mychats