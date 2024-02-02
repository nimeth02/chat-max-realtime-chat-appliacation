import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Avatar,
    Text,
    Input,
    useToast,
    Box,
  } from '@chakra-ui/react'
import { ChatState } from '../../../context/chatContext';
import axios from 'axios';
import UserListItem from '../UserListItem';
import UserBadgeItem from '../UserBadgeItem';
function GroupChatModal({children}) {
    const [groupName,setGroupName]=useState("")
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
  
    const { user, chats, setChats } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleSearch = async (query) => {
      setSearch(query)
      if (!query) {
        return;
      }
 
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`/api/user?search=${query}`, config);
        console.log(data);
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    const handleGroup=(toAddUser)=>{
      if(selectedUsers.includes(toAddUser)){
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    else{
      setSelectedUsers([...selectedUsers,toAddUser])
    }
  }

  const handleDelete=(user)=>{
    setSelectedUsers((su)=>su.filter((su)=> su._id != user._id))
  }

    const handleSubmit=async()=>{
      if (!groupName || !selectedUsers) {
        toast({
          title: "Please fill all the feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post( `/api/chat/group`,
          {
            name: groupName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          },
          config
        );
        console.log(data)
        setChats([data, ...chats]);
        onClose();
        setGroupName("")
        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        toast({
          title: "Failed to Create the Chat!",
          description: error.response.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      finally{
        setSearchResult([]);setSelectedUsers([]);
      }
    }

    


  return (
    <div>
        <span onClick={onOpen}>{children}</span>
        <Modal isOpen={isOpen} onClose={()=>{onClose();setSearchResult([]);setSelectedUsers([]);setGroupName("")}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader b="flex" align="center" fontSize={"28px"}>Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody b="flex" align="center" >
        
          <Input placeholder='Group Name' value={groupName} onChange={(e)=>setGroupName(e.target.value)} mb="25px"/>

          <Input
                placeholder="Search Users"
                mr={2}
                // value={search}
                onChange={(e) => handleSearch(e.target.value)}
                mb="50px"
              />
              <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers?.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
              {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Create
            </Button>      
          
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default GroupChatModal