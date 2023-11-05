const express = require('express')
const multer = require('multer')
const cors = require('cors');
const axios = require('axios')

const app = express()
const port=process.env.PORT || 5000

app.use(express.json())

const upload = multer({
    limits:{
        fileSize:10000000
    }
})

const starton = axios.create({
    baseURL: "https://api.starton.io/v3",
    headers: {
        "x-api-key": "sk_live_dc1aa7a8-53ac-4a3c-8261-e19e75f2b5d7",
    },
  })

  app.post('/upload',cors(),upload.single('file'),async(req,res)=>{
    let data = new FormData();
    // console.log(req);
    const blob = new Blob([req.file.buffer],{type:req.file.mimetype});
    data.append("file",blob,{filename:req.file.originalnam})
    data.append("isSync","true");
    console.log("hello")
    console.log(data);
    console.log("hello")
    async function uploadImageOnIpfs(){
        const ipfsImg = await starton.post("/ipfs/file", data, {
            headers: { "Content-Type": `multipart/form-data; boundary=${data._boundary}` },
          })
          return ipfsImg.data;
    }
    async function uploadMetadataOnIpfs(imgCid){
        const metadataJson = {
            name: `A Wonderful NFT`,
            description: `Probably the most awesome NFT ever created !`,
            image: `ipfs://ipfs/${imgCid}`,
        }
        const ipfsMetadata = await starton.post("/ipfs/json", {
            name: "My NFT metadata Json",
            content: metadataJson,
            isSync: true,
        })
        return ipfsMetadata.data;
    }
    
    const SMART_CONTRACT_NETWORK="polygon-mumbai"
    const SMART_CONTRACT_ADDRESS="0x3AC5b4E415953C98B008f8DdCDD9AFcf9f1A044f"
    const WALLET_IMPORTED_ON_STARTON="0x15E28a899f08Dcec86732902C9250b62318B598a";
    async function mintNFT(receiverAddress,metadataCid){
        const nft = await starton.post(`/smart-contract/${SMART_CONTRACT_NETWORK}/${SMART_CONTRACT_ADDRESS}/call`, {
            functionName: "mint",
            signerWallet: WALLET_IMPORTED_ON_STARTON,
            speed: "low",
            params: [receiverAddress, metadataCid],
        })
        return nft.data;
    }
    const RECEIVER_ADDRESS = "0xd2224E74C8f5B823fD7891C111757f0d487eE8D0"
    const ipfsImgData = await uploadImageOnIpfs();
    const ipfsMetadata = await uploadMetadataOnIpfs(ipfsImgData.cid);
    const nft = await mintNFT(RECEIVER_ADDRESS,ipfsMetadata.cid)
    console.log(nft)
    const RECEIVER_ADDRESS2 = "0xD83b4eB0118a3d9E02DdC4eB6f16eC0fAF8Cd495"
    const ipfsImgData2 = await uploadImageOnIpfs();
    const ipfsMetadata2 = await uploadMetadataOnIpfs(ipfsImgData2.cid);
    const nft2 = await mintNFT(RECEIVER_ADDRESS2,ipfsMetadata2.cid)
    console.log(nft2)
    res.status(201).json({
        transactionHash:nft.transactionHash,
        cid:ipfsImgData.cid,
        transactionHash2:nft2.transactionHash,
        cid2:ipfsImgData2.cid
    })
  })
  app.listen(port,()=>{
    console.log('Server is running on port '+ port);
  })