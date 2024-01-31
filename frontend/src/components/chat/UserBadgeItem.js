import { CloseIcon } from '@chakra-ui/icons'
import { Badge } from '@chakra-ui/react'
import React from 'react'

function UserBadgeItem({handleFunction,user}) {
  return (
    <Badge
    px={2}
    py={1}
    borderRadius="lg"
    m={1}
    mb={2}
    variant="solid"
    fontSize={12}
    colorScheme="green"
    cursor="pointer"
    textTransform="lowercase"
    onClick={handleFunction}
  >
    {user.name}
    {/* {admin === user._id && <span> (Admin)</span>} */}
    <CloseIcon pl={1} />
  </Badge>
  )
}

export default UserBadgeItem