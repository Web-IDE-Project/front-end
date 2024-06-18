import { Flex, Text } from '@chakra-ui/react'
import UserItem from './UserItem'
import { Document, Indexable } from 'yorkie-js-sdk'
import { ContainerDoc } from '@/hooks/useYorkieClient'
import { useEffect } from 'react'

const PermissionSettings = ({
  docRef,
}: {
  docRef: React.MutableRefObject<Document<ContainerDoc, Indexable> | undefined>
}) => {
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

  if (docRef && docRef.current) {
    docRef.current.subscribe('presence', event => {
      console.log(docRef!.current!.getPresences())
    })
  }

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
