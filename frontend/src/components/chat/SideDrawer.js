import { Flex ,Box, Tooltip, Button,Text, MenuDivider, MenuItem, Avatar, MenuButton, Menu, MenuList, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody, Input, DrawerFooter, DrawerHeader, useDisclosure, Toast, useToast, Spinner} from '@chakra-ui/react'
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon, Search2Icon } from '@chakra-ui/icons'
import NotificationBadge from "react-notification-badge";
import { ChatState } from '../../context/chatContext'
import ProfileModal from './components/ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
function SideDrawer() {
  const [search,setSearch]=useState("")
  const [loading,setLoading]=useState(false)
  const [searchResult,setSearchResult]=useState([])
  const [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();
  const btnRef = React.useRef()
  const navigate=useNavigate()
  const {user, selectedChat,setSelectedChat,chats,setChats}=ChatState()

  const handleLogout=()=>{
    localStorage.removeItem("userInfo")
    navigate('/')
  }
  const handleSearch=async()=>{
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      // console.log(data)
      setSearchResult(data);
      setLoading(false);
      
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
  }
 
  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

     if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
     console.log(data)
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <Flex   bg="white"
    w="100%" justify="space-between" >
      <Box >
      <Tooltip label="Search Users to chat" hasArrow placement="bottom-end" >
          <Button variant="ghost"onClick={onOpen} >
            <i className="fas fa-search"></i>
            <Search2Icon/>
            <Text  px={4} fontSize={"18px"}>
              Search User
            </Text>
          </Button>
        </Tooltip>
      </Box>
      <Box >
      <Text fontSize="2xl" fontFamily="Work sans" >
          Chat-MAX
        </Text>
      </Box>
      <Box>
      
      <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout} >Logout</MenuItem>
            </MenuList>
          </Menu>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" > Search Users</DrawerHeader>

          <DrawerBody>
          <Flex d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Flex>
            {loading ? (
              <ChatLoading />
            ) : (
              
              searchResult?.map((user) => (
               
                <UserListItem
                  key={user._id}
                  user={user}
                   handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
          
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>

          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {loadingChat && <Spinner ml="auto" d="flex" />}
    </Flex>
  )
}

export default SideDrawer