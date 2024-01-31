import { Avatar, Text, Tooltip } from '@chakra-ui/react'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { ChatState } from '../../context/chatContext';

function ScrollableChat({messages}) {

    const { user } = ChatState();
  return (
    <ScrollableFeed>
    {messages &&
      messages.map((m, i) => (
        <div style={{ display: "flex" ,justifyContent: m.sender._id === user._id ? "end" : "start"}} key={m._id}>
         
          
          <span
            style={{
              backgroundColor: `${
                m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
              }`,
            //   marginLeft: isSameSenderMargin(messages, m, i, user._id),
              marginTop: isSameUser(messages, m, i, user._id) ? 3 : 20,
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
              
            }}
          >
             <Text fontSize='xs'  align={"right"} color="gray">
              {(!isSameUser(messages, m, i, user._id) &&  m.sender._id != user._id) && m.sender.name}
             </Text>
            
          
            {m.content}
          </span>
        </div>
      ))}
  </ScrollableFeed>
  )
}

const isSameUser=(messages,m,i,userId)=>{

    if((i != 0 ) && (messages[i-1].sender._id == messages[i].sender._id)){
                       return true
}

}


export default ScrollableChat