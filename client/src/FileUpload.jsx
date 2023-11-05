import {useState} from "react";
const FileUpload=()=>{
    
const [file,setFile]=useState(null);
const [cid,setCid]=useState("");
const [transaction,setTransaction]=useState("");
const [cid2,setCid2]=useState("");
const [transaction2,setTransaction2]=useState("");

// const submitText = async() => {
//     const txt = {
//         text1, 
//         text2
//     }
//     const response = await fetch('http://localhost:5000/textUpload',{
//         method:'POST',
//         headers:{
//              'Content-Type': 'application/json',
//         },
//         body: txt
//     });
//      const json = await response.json()
//      console.log(json)
// }


const handleSubmit =async(event)=>{
    event.preventDefault();


     try{
         if(file){
             const formData = new FormData();
             formData.append("file",file);
            //  console.log(formData.text1);
             const response = await fetch('http://localhost:5000/upload',{
                 method:'POST',
                 body:formData
             }).then(response=>response.json())
             .then(data=>{ 
                setCid(data.cid);
                setTransaction(data.transactionHash)
                console.log(data.cid)
                console.log(data.transactionHash)
                setCid2(data.cid2);
                setTransaction2(data.transactionHash2)
                console.log(data.cid2)
                console.log(data.transactionHash2)
             })
             .catch(error=>{
                 console.error(error);
             })
         }
     }catch(error){
        alert(error);
     }
}
const retreieveFile=(event)=>{
    try{
        const data = event.target.files[0];
        setFile(data);
        
        event.preventDefault();
    }catch(error){
        alert("Retrieve File Does Not Worked");
    }
}
return<>
 <div className="img-ctr">
    {cid && <a href={`https://${cid}.ipfs.dweb.link`}><img src={`https://${cid}.ipfs.dweb.link`} height={"250px"} /></a>}
    </div>
    <div className="transaction">
     {transaction && <a href={`https://mumbai.polygonscan.com/tx/${transaction}`}>Transaction 1 Details</a>}
</div>
 <div className="img-ctr">
    {cid && <a href={`https://${cid2}.ipfs.dweb.link`}><img src={`https://${cid2}.ipfs.dweb.link`} height={"250px"} /></a>}
    </div>
    <div className="transaction">
     {transaction && <a href={`https://mumbai.polygonscan.com/tx/${transaction2}`}>Transaction 2 Details</a>}
</div>
 <div className="form">
    <form onSubmit={handleSubmit}>
    <input type="file" className="choose" onChange={retreieveFile}/>
    <button className="btn">NFT Minter</button>
    </form>
    </div>
</>
}
export default FileUpload;