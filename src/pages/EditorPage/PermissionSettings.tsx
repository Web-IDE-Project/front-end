import { Flex, Text } from '@chakra-ui/react'
import UserItem from './UserItem'

const PermissionSettings = () => {
  const userList = [
    {
      id: 1,
      profile: '',
      nickname: 'user1',
      isMicAllow: false,
      isEditAllow: false,
    },
    {
      id: 2,
      profile: '',
      nickname: 'user2',
      isMicAllow: true,
      isEditAllow: false,
    },
    {
      id: 3,
      profile: '',
      nickname: 'user3',
      isMicAllow: false,
      isEditAllow: true,
    },
  ]

  return (
    <>
      <Text fontSize="sm" pb={3}>
        권한 제어
      </Text>
      <Flex direction="column" gap={3}>
        {userList.map(({ id, profile, nickname, isMicAllow, isEditAllow }) => (
          <UserItem
            key={id}
            profile={profile}
            nickname={nickname}
            isMicAllow={isMicAllow}
            isEditAllow={isEditAllow}
          />
        ))}
      </Flex>
    </>
  )
}

export default PermissionSettings
