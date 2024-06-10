import { Avatar, Flex, IconButton, Spacer } from '@chakra-ui/react'
import { VscFiles } from 'react-icons/vsc'
import { VscTerminal } from 'react-icons/vsc'
import { IoPeopleOutline } from 'react-icons/io5'
import { ArrowBackIcon, SettingsIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'

const MenuBar = () => {
  const navigate = useNavigate()

  return (
    <Flex
      direction="column"
      p={2}
      gap={2}
      align="center"
      borderRight="1px"
      borderColor="gray.200"
    >
      <IconButton aria-label="explorer" icon={<VscFiles />} fontSize="20px" />
      <IconButton
        aria-label="terminal"
        icon={<VscTerminal />}
        fontSize="20px"
      />
      <IconButton
        aria-label="terminal"
        icon={<IoPeopleOutline />}
        fontSize="20px"
      />
      <Spacer />
      <Avatar name="User" size="sm" src="https://bit.ly/dan-abramov" />
      <IconButton
        aria-label="back"
        icon={<ArrowBackIcon />}
        fontSize="20px"
        onClick={() => navigate('/container')}
      />
      <IconButton
        aria-label="settings"
        icon={<SettingsIcon />}
        fontSize="20px"
      />
    </Flex>
  )
}

export default MenuBar
