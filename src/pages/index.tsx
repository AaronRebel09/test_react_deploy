// src/pages/index.tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import { VStack, HStack, Heading, Box } from "@chakra-ui/layout"
import { Center } from '@chakra-ui/react'
import ConnectMetamask from '../components/ConnectMetamask'
import ETHBalanceSWR from '../components/ETHBalanceSWR'
import ReadERC721 from '../components/ReadERC721'
import { addressNFTContract, addressMarketContract }  from '../projectsetting'
import ReadNFTMarket from '../components/ReadNFTMarket'

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>CodeFriends Daap</title>
      </Head>

      <Heading as="h3"  my={4} >
        <Center>
            YEAT NFT Marketplace
        </Center>
      </Heading>

      <ConnectMetamask />

      <VStack>
        <Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
          <Heading my={4}  fontSize='xl'>Tickets - En venta</Heading>
          <ReadNFTMarket  option={0} />
        </Box>

        <Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
          <Heading my={4}  fontSize='xl'>Tickets - Comprados</Heading>
          <ReadNFTMarket  option={1} />
        </Box>

        <Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
          <Heading my={4}  fontSize='xl'>Tickets - Usados - Mi colección</Heading>
          <ReadNFTMarket  option={3} />
        </Box>

        <Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
          <Heading my={4}  fontSize='xl'>Balance de ETH<b> mediante SWR</b></Heading>
          <ETHBalanceSWR />
        </Box>

        <Box  my={4} p={4} w='100%' borderWidth="1px" borderRadius="lg">
          <Heading my={4}  fontSize='xl'>BadgeToken: ERC721 Smart Contract Info</Heading>
          <ReadERC721 addressContract={addressNFTContract} />
        </Box>

      </VStack>
    </>
  )
}

export default Home