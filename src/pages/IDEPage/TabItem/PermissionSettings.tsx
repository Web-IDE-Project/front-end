import { Flex, Text } from '@chakra-ui/react'
import UserItem from './UserItem'
import { Document, Indexable } from 'yorkie-js-sdk'
import { ContainerDoc } from '@/hooks/useYorkieClient'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@/hooks'
import { selectId } from '@/store/userSlice'

interface user {
  id: number
  profile: string
  nickname: string
  isMicAllow: boolean
  isEditAllow: boolean
}

const PermissionSettings = ({
  docRef,
}: {
  docRef: React.MutableRefObject<Document<ContainerDoc, Indexable> | undefined>
}) => {
  const [userList, setUserList] = useState<user[]>()
  const userId = useAppSelector(selectId)

  useEffect(() => {
    if (docRef && docRef.current) {
      // yorkie 문서에 저장해둔 권한 리스트
      // { userId: '권한' } 형태
      const usersPermission = docRef.current.getRoot().users.toJS!()
      console.log(usersPermission)

      docRef.current.subscribe('presence', _ => {
        console.log(docRef.current?.getPresences())

        const users = docRef!
          .current!.getPresences()
          // .filter(presence => presence.presence.id !== userId)
          .map(presence => {
            return {
              id: presence.presence.id,
              profile: '',
              nickname: presence.presence.nickname,
              isMicAllow: false,
              isEditAllow: usersPermission[presence.presence.id] !== 'viewer',
            }
          })
        setUserList(users)
      })
    }
  }, [docRef])

  // edit 버튼 클릭 시 viewer -> editor, editor -> viewer로 상태를 토글한다.
  const onEditToggleButtonClick = (userId: number, isEditAllow: boolean) => {
    docRef.current?.update(root => {
      root.users[userId] = isEditAllow ? 'viewer' : 'editor'
    })
  }

  return (
    <>
      <Text fontSize="sm" pb={3}>
        권한 제어
      </Text>
      <Flex direction="column" gap={3}>
        {userList?.map(({ id, profile, nickname, isMicAllow, isEditAllow }) => (
          <UserItem
            key={id}
            userId={id}
            profile={profile}
            nickname={nickname}
            isMicAllow={isMicAllow}
            isEditAllow={isEditAllow}
            onEditToggleButtonClick={onEditToggleButtonClick}
          />
        ))}
      </Flex>
    </>
  )
}

export default PermissionSettings
