import React, {  useState } from 'react'
import { ChatState } from '../context/chatContext'
import {  Flex } from '@chakra-ui/react'
import SideDrawer from '../components/chat/SideDrawer'
import Mychats from '../components/chat/Mychats'
import Chatbox from '../components/chat/Chatbox'

function ChatPage() {
  const {user}=ChatState()
  const [fetchAgain,setFetchAgain]=useState()

  return  (
     <div style={{ width: "100%" }}>
      {user &&<> <SideDrawer />
       <Flex  justifyContent="space-between" w="100%" h="91.5vh" p="10px" >
        
        <Mychats fetchAgain={fetchAgain}/>
        
        
          <Chatbox  setFetchAgain={setFetchAgain} fetchAgain={fetchAgain}/>
        
      </Flex>
      </> }
    </div>
  )
}

export default ChatPage