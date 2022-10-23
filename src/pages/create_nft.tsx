import { useEffect,useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { Contract } from "@ethersproject/contracts";
import { addressNFTContract, addressMarketContract, pinataKey, pinataSecret }  from '../projectsetting'
import { BigNumber, ethers } from 'ethers';
import { Button, Text, Input  } from "@chakra-ui/react"
import ConnectMetamask from '../components/ConnectMetamask'
import axios from 'axios';
import { parseEther } from "@ethersproject/units"




export default function CommentPage() {
  
    const [imageFile, setImageFile] = useState('')
    const [image, setImage] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [currId, setCurrId] = useState(null);

    const abiJSON = require("../abi/BadgeToken.json")
    const abi = abiJSON.abi
    
    const abiJSONMarket = require("../abi/NFTMarketplace.json")
    const abiMarket = abiJSONMarket.abi

    const {  account, active, library} = useWeb3React<Web3Provider>()

  useEffect( () => {

        // console.log(addressContract,abi,library)
        /*if(currId !== null) {
            const nft:Contract = new Contract(addressNFTContract, abi, library.getSigner());
            console.log(nft.provider)
            console.log(account)
            //Mint of a Token
            nft.mintTo(account, "https://ipfs.io/ipfs/QmeCYwuEMuBFTs9Zh5ikpAH1zR3pJzvBEzbksyNjfntAHb").catch('error', console.error)
            nft._getCurrentTokenId().then((id:any)=>{
                setCurrId(id)
            })
            console.log(currId);
        } */
        console.log(currId);
    },[active,account,currId])

    async function createNFTMarketItem(event:React.FormEvent) {
        event.preventDefault()

        if(!(active && account && library)) return
      
        //TODO check whether item is available beforehand
        const nft:Contract = new Contract(addressNFTContract, abi, library.getSigner());
        console.log(nft.provider)
        console.log(account)

        //Mint of a Token
        await(await nft.mintTo(account, "https://ipfs.io/ipfs/QmeCYwuEMuBFTs9Zh5ikpAH1zR3pJzvBEzbksyNjfntAHb").catch('error', console.error)).wait()

        const nftGet:Contract = new Contract(addressNFTContract, abi, library);
        
        let result = await nftGet._getCurrentTokenId().then((result:any)=>{
            return result._hex
        });

        console.log('result', result);

        let id = parseInt(result.replace('0x',''));

        console.log('id', id);

        await(await nft.approve(addressMarketContract, id).catch('error', console.error)).wait();

        console.log('approved!');

        const market:Contract = new Contract(addressMarketContract, abiMarket, library.getSigner());

        //const listingFee = await marketGet.getListingFee({from:account});

        //console.log('fee', listingFee);
        const auctionPrice = ethers.utils.parseUnits('1', 'ether')
        const listingFee = ethers.utils.parseUnits('0.025', 'ether')

        await (await market.createMarketItem(addressNFTContract, id, auctionPrice, { value: listingFee}).catch('error', console.error)).wait();

        console.log('created Item!');

        /*const marketGet:Contract = new Contract(addressMarketContract, abiMarket, library);

        library.getCode(addressMarketContract).then((result:string)=>{
            console.log('code', result)
            //check whether it is a contract
            if(result === '0x') return

            marketGet.getListingFee({from:account}).then((items:any)=>{
                console.log('items', items)
            });

            marketGet.fetchActiveItems({from:account}).then((items:any)=>{
                console.log('items', items)
            }); 
        });

        

        console.log('listed Item!');*/


        /*nftGet._getCurrentTokenId().then((result:any)=>{
            
            if(result === '0x') return
            
            let id = parseInt(result._hex.replace('0x',''))

            console.log('id token', id)

            //Agregamos item al market place
            nft.approve(addressMarketContract, id).then((result:any)=>{
                console.log('fee', result);
            }).catch('error', console.error)

            //Listing Fee
            /*market.getListingFee().then((result:any)=>{
                console.log('fee', result);
            })*/

            //market.createMarketItem(addressNFTContract, id, { eth }, { value: listingFee })


        //})
    }

    const sendFileToIPFS = async (e) => {
        e.preventDefault()
        if (imageFile) {
            try {

                const formData = new FormData();
                formData.append("file", imageFile);

                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        'pinata_api_key': pinataKey,
                        'pinata_secret_api_key': pinataSecret,
                        "Content-Type": "multipart/form-data"
                    },
                });

                const ImgHash = `https://ipfs.io/ipfs://${resFile.data.IpfsHash}`;
             console.log(ImgHash); 
             setImage(ImgHash)
            //Take a look at your Pinata Pinned section, you will see a new file added to you list.   



            } catch (error) {
                console.log("Error sending File to IPFS: ")
                console.log(error)
            }
        }
    }

    const createNFT = async () => {
        if (!image || !name || !description) return
        try{
          const result = JSON.stringify({image, name, description})
          mintThenList(result)
        } catch(error) {
          console.log("ipfs uri upload error: ", error)
        }
      }

      const mintThenList = async (result) => {
        // mint nft 
        await(await nft.mint(uri)).wait()
        // get tokenId of new nft 
        const id = await nft.tokenCount()
        // approve marketplace to spend nft
        await(await nft.setApprovalForAll(marketplace.address, true)).wait()
        // add nft to marketplace
        const listingPrice = ethers.utils.parseEther(price.toString())
        await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
      }

  return (
    <>
    
      <ConnectMetamask />

      <form onSubmit={sendFileToIPFS}>
        <Input variant='outline' placeholder='Nombre' />
        <Input variant='outline' placeholder='Descripción' />
        <input type="file" onChange={(e) =>setImageFile(e.target.files[0])} required />
        <button type='submit' >Save NFT</button>  

        <Button width={220} type="submit" onClick={(e)=>createNFTMarketItem(e)}>Save NFT to Market</Button>          
      </form>
    </>
  )
}