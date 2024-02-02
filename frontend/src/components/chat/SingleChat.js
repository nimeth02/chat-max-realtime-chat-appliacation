import { ArrowBackIcon, ViewIcon } from '@chakra-ui/icons'
import { Box, Flex, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/chatContext'
import ProfileModal from './components/ProfileModal';
import UpdateGroupChatModal from './components/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import { io } from 'socket.io-client';
const ENDPOINT = "https://chatmax.onrender.com"; 
var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat,chats,setChats } = ChatState()
  const toast = useToast();


  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message?chatId=${selectedChat._id}`,
        config
      );
      // console.log(data);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat",selectedChat._id)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(error)
    }
  }
  const sendMessage = async (e) => {
    if (e.key == "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        socket.emit("new message",data)
        setMessages([...messages, data]);
        
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }
  const typingHandler = (e) => {
    setNewMessage(e.target.value)
  }
  
  useEffect(() => {
    fetchMessages();
    selectedChatCompare=selectedChat
    // eslint-disable-next-line
  }, [selectedChat]);

  
  useEffect(()=>{
    // socket=io(ENDPOINT) changed
    socket=io(ENDPOINT)
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  },[user])


  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      console.log(newMessageRecieved.chat?._id,selectedChatCompare?._id,"compare compare")
      if (
         (selectedChatCompare?._id != newMessageRecieved?.chat._id)
      ) {
  
       console.log("wrong chat");
       
      }
      else{
        setMessages([...messages, newMessageRecieved]);
        console.log("correct chat");
      }
      setChats(()=>{
        // console.log(chats)
       return chats && chats?.filter((chat)=>{
          if(chat._id == newMessageRecieved.chat?._id){
          chat.latestMessage=newMessageRecieved
          console.log(chat,"changed")
             return chat
          }
          else{
            console.log(chat)
            return chat
          }
        })
       })
   
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {/* {messages && */}
            {!selectedChat.isGroupChat ? (
              <>
                {/* {getSender(user, selectedChat.users)} */}
                {selectedChat.users[0]?._id === user?._id ? selectedChat.users[1].name : selectedChat.users[0].name}
                <ProfileModal
                  user={selectedChat.users[0]?._id === user?._id ? selectedChat.users[1] : selectedChat.users[0]}
                > <IconButton d={{ base: "flex" }} icon={<ViewIcon />} /></ProfileModal>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                ><IconButton d={{ base: "flex" }} icon={<ViewIcon />} /></UpdateGroupChatModal>
              </>
            )}
            {/* } */}
          </Text>
          <Flex
            d="flex"
            flexDir="column"
            justify="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="90%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages" style={{overflow:"scroll", display:"flex",flexDirection:"column",scrollbarWidth:"none"}}>
           
                   <ScrollableChat messages={messages} />
              
               
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
             
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Flex>
        </>
      ) : (
        // to get socket.io on same page
        <Flex align="center" justify="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans" aligh="center" >
            Click on a chat to start chatting
          </Text>
        </Flex>
      )}
    </>
  )
}

export default SingleChat
