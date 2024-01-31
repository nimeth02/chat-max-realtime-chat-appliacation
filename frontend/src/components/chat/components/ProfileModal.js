import React from 'react'
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
  } from '@chakra-ui/react'
import { ChatState } from '../../../context/chatContext'
function ProfileModal({children,user}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <div onClick={onOpen}>{children}</div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader b="flex" align="center" fontSize={"28px"}>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody b="flex" align="center">
          <Avatar
                size="xl"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
              <Text m="5">
                {user.email}
              </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='yellow' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal