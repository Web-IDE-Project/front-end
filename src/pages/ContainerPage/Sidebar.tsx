import { ArrowLeftIcon } from '@chakra-ui/icons'
import { AspectRatio, Avatar, Flex, Image, Spacer } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const categories = [
    { name: '내 컨테이너', path: '/container/my' },
    { name: '강의 컨테이너', path: '/container/lecture' },
    { name: '질문 컨테이너', path: '/container/question' },
  ]

  return (
    <Flex direction="column" width="300px">
      <Flex align="center">
        <AspectRatio ratio={20 / 6}>
          <Image
            width="80px"
            src="src/assets/images/logo.png"
            alt="3Ever"
            objectFit="fill"
          />
        </AspectRatio>
        <Spacer />
        <ArrowLeftIcon />
      </Flex>
      <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
      {categories.map((category, index) => {
        return (
          <NavLink key={index} to={category.path}>
            {category.name}
          </NavLink>
        )
      })}
    </Flex>
  )
}

export default Sidebar
