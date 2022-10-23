import React, { useEffect,useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { Box, Center, Text} from '@chakra-ui/react'
import useSWR from 'swr'
import { ERC721ABI as abi} from "../abi/ERC712ABI"
import { BigNumber } from 'ethers'
import { fetcher } from '../utils/fetcher'
import axios from 'axios';


const base64 = require( "base-64")

interface Props {
    addressContract: string,
    tokenId:BigNumber,
    name: string,
    description: string
}

interface ItemInfo{
  tk:string,
  name:string,
  description:string,
  uri:string
}

export default function CardERC721(props:Props){
  const addressContract = props.addressContract
  const {  account, active, library } = useWeb3React<Web3Provider>()

  const [itemInfo, setItemInfo] = useState<ItemInfo>()

  const { data: nftURI } = useSWR([addressContract, 'tokenURI', props.tokenId], {
    fetcher: fetcher(library, abi),
  })

useEffect( () => {
  if(!nftURI) return
  console.log('uri', nftURI);

  /* try {
    
    const meta = axios.get(nftURI);
    console.log('meta', base64.decode(meta?.data));
    } catch (error) {
      console.log("Error sending File to IPFS: ")
      console.log(error)
  }

  const data = base64.decode(nftURI.slice(29))
  console.log('data',data)
  const itemInfo = JSON.parse(data)*/
  //const svg = base64.decode(itemInfo.image.slice(26))
  setItemInfo({
    "tk": 'Ticket #' + props.tokenId,
    "name": props.name,
    "description": props.description,
    "uri": nftURI})

},[nftURI])
//<img src={`data:image/svg+xml;utf8,${itemInfo.svg}`} alt={itemInfo.name} width= '200px' />
return (
  <Box my={2} bg='gray.100' borderRadius='md' width={220} px={3} py={4}>
  {itemInfo
  ?<Box>
    <Center>
      <Text fontSize='xl' px={2} py={2}>{itemInfo.tk}</Text>
    </Center>
    <img src={itemInfo.uri} alt={itemInfo.name} width= '200px' />
    <Center>
      <Text fontSize='sm' px={5} pb={1}>{itemInfo.name}</Text>
    </Center>
    <Center>
      <Text fontSize='sm' px={5} pb={1}>{itemInfo.description}</Text>
    </Center>
  </Box>
  :<Box />
  }
  </Box>
)
}
