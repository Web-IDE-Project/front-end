import { Box } from '@chakra-ui/react'

interface Props {
  category: string
}

const ContainerList = ({ category }: Props) => {
  return <Box bg="gray.50">{category}</Box>
}

export default ContainerList
