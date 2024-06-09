import { AddIcon, Search2Icon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
} from '@chakra-ui/react'

import container_list from '@/data/container-list.json'
import ContainerItem from './ContainerItem'

interface Props {
  category: string
}

const ContainerList = ({ category }: Props) => {
  // TODO - 카테고리에 따라 컨테이너 리스트를 요청해 받아온다.
  const containerList = container_list

  return (
    <Box p={5}>
      <Heading size="lg" mt={16}>
        {category}
      </Heading>
      <Box mt={5}>
        {/* NOTE - 컨테이너 생성 버튼은 '내 컨테이너'에서만 보인다. */}
        {category === '내 컨테이너' ? (
          <Button
            leftIcon={<AddIcon />}
            colorScheme="green"
            variant="solid"
            size="sm"
          >
            새로운 컨테이너
          </Button>
        ) : (
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Search2Icon color="gray.300" />
            </InputLeftElement>
            <Input
              type="string"
              placeholder="검색"
              size="sm"
              focusBorderColor="green.400"
              bg="white"
              borderRadius="md"
              w="200px"
            />
          </InputGroup>
        )}
      </Box>

      {/* SECTION - 컨테이너 리스트 */}
      <Box mt={5}>
        <SimpleGrid
          spacing={4}
          templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
        >
          {containerList.map(container => (
            <ContainerItem
              key={container.id}
              category={category}
              id={container.id}
              title={container.title}
              language={container.language}
              description={container.description}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  )
}

export default ContainerList
