import express from 'express'
import { ObjectId } from 'mongodb';
import { client, createNewFriendship, createNewUser, getFriendListOfUser, updateSingleUser } from './mongodb/mainMongo.js';
import { listAllUsers } from './mongodb/mainMongo.js';
import cors from 'cors'
const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:false}))

const main = async() => {
    await client.connect()
}
main()
.then(
    ()=>{console.log('🎉 connected to database successfully')}
)
.catch(error => console.error(error));
  

app.get('/',(req,res)=>{
    res.send("hello world")

})

app.get('/getAllUsers', async(req,res)=>{
    const result = await listAllUsers(client)
    res.send(result)
})

app.post('/updateUserStatus', async(req,res)=>{
    // const result = await listAllUser(client)
    const client_sent_obj = req.body
    const obj_Id = client_sent_obj["id"]
    const newStatus = client_sent_obj["status"]
    if (obj_Id && newStatus){
        console.log(obj_Id.length)
    
        await updateSingleUser(client,{"id" : obj_Id},{"status": `${newStatus}`})
        res.send({"status": "update successfully"})
    }
    else{
    // console.log(obj.name)
    //console.log(obj_Id)
    //console.log(newStatus)
    res.send({"status": "update unsuccessfully"})
    }
})

app.post('/updateUserAddress', async(req,res)=>{
    // const result = await listAllUser(client)
    const client_sent_obj = req.body
    const obj_Id = client_sent_obj["id"]
    const newAddress = client_sent_obj["address"]
    if (obj_Id && newAddress){
        //console.log(obj_Id.length)
    
        await updateSingleUser(client,{"id" : obj_Id},{"address": `${newAddress}`})
        res.send({"status": "update successfully"})
    }
    else{
    // console.log(obj.name)
    //console.log(obj_Id)
    //console.log(newStatus)
    res.send({"status": "update unsuccessfully"})
    }
})


app.post('/getFriendList', async(req,res)=>{
    // const result = await listAllUser(client)
    const client_sent_obj = req.body
    const obj_Id = client_sent_obj["id"]
    if (obj_Id ){
        //console.log(obj_Id.length)
    
        const result = await getFriendListOfUser(client, {"id": obj_Id})
        res.send(result)
    }
    else{
    // console.log(obj.name)
    //console.log(obj_Id)
    //console.log(newStatus)
    res.send({"status": "getFriendList unsuccessfully"})
    }
})



app.post('/createFriendship', async(req,res)=>{
    // const result = await listAllUser(client)
    const client_sent_obj = req.body
    const peerID = client_sent_obj["peerID"]
    const friendID = client_sent_obj["friendID"] 
    if (peerID && friendID ){
        //console.log(obj_Id.length)
        const result = await createNewFriendship(client, peerID, friendID)
        if (result){
            res.send({"status":"createFriendship successfully"})
        }
        else{
            res.send({"status" : "createFriendship unsuccessfully"})
        }
    }
    else{
    // console.log(obj.name)
    //console.log(obj_Id)
    //console.log(newStatus)
    res.send({"status": "createFriendship unsuccessfully"})
    }
})


app.post('/createNewUser', async(req,res)=>{
    // const result = await listAllUser(client)
    const client_sent_obj = req.body
    const status = client_sent_obj["status"]
    const address = client_sent_obj["address"]
    const name = client_sent_obj["name"]
    const last_name = client_sent_obj["last_name"]
    if (status && address && name && last_name){
        await createNewUser(client,{"address": address, "name" : name, "last_name" : last_name, "status" : status})
        res.send({"status": "create  successfully"})
    }
    else{
    // console.log(obj.name)
    res.send({"status": "create unsuccessfully"})
    }
})



app.listen(process.env.PORT || 3001, ()=>{console.log("listening on port 3001")})