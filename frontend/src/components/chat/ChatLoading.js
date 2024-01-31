import { Skeleton, VStack } from '@chakra-ui/react'
import React from 'react'

function ChatLoading() {
  return (
    <div><VStack>
    <Skeleton height='20px' />
    <Skeleton height='20px' />
    <Skeleton height='20px' />
  </VStack>
  </div>
  )
}

export default ChatLoading