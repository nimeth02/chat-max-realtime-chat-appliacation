import { Avatar, Box, Text,Flex } from '@chakra-ui/react'
import React from 'react'

function UserListItem({user,handleFunction}) {

  return (
    <Flex
    onClick={handleFunction}
    cursor="pointer"
    bg="#E8E8E8"
    _hover={{
      background: "#38B2AC",
      color: "white",
    }}
    w="100%"
    d="flex"
    alignItems="center"
    color="black"
    px={3}
    py={2}
    mb={2}
    borderRadius="lg"
  >
    <Avatar
      mr={2}
      size="sm"
      cursor="pointer"
      name={user.name}
      src={user.pic}
    />
    <Box>
      <Text>{user.name}</Text>
      <Text fontSize="xs">
        <b>Email : </b>
        {user.email}
      </Text>
    </Box>
  </Flex>
  )
}

export default UserListItem