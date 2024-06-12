import { Avatar, Flex, IconButton, Spacer } from '@chakra-ui/react'
import { VscFiles } from 'react-icons/vsc'
import { VscTerminal } from 'react-icons/vsc'
import { IoPeopleOutline } from 'react-icons/io5'
import { ArrowBackIcon, SettingsIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import {
  selectShowExplorer,
  selectShowPermissionSettings,
  selectShowTerminal,
  toggleExplorer,
  togglePermissionSettings,
  toggleTerminal,
} from '@/store/ideSlice'

const Tab = () => {
  const navigate = useNavigate()

  const showTerminal = useAppSelector(selectShowTerminal)
  const showExplorer = useAppSelector(selectShowExplorer)
  const showPermissionSettings = useAppSelector(selectShowPermissionSettings)

  const dispatch = useAppDispatch()

  return (
    <Flex
      direction="column"
      p={2}
      gap={2}
      align="center"
      borderRight="1px"
      borderColor="gray.200"
    >
      <IconButton
        aria-label="explorer"
        icon={<VscFiles />}
        fontSize="20px"
        bgColor={showExplorer ? 'gray.100' : 'transparent'}
        onClick={() => {
          dispatch(toggleExplorer())
        }}
      />
      <IconButton
        aria-label="terminal"
        icon={<VscTerminal />}
        fontSize="20px"
        bgColor={showTerminal ? 'gray.100' : 'transparent'}
        onClick={() => {
          dispatch(toggleTerminal())
        }}
      />
      <IconButton
        aria-label="terminal"
        icon={<IoPeopleOutline />}
        fontSize="20px"
        bgColor={showPermissionSettings ? 'gray.100' : 'transparent'}
        onClick={() => {
          dispatch(togglePermissionSettings())
        }}
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

export default Tab
