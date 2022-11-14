import { MongoClient, ObjectId } from "mongodb";


const uri = "mongodb+srv://namkhoa:namkhoapro@cluster0.8p7d3.mongodb.net/?retryWrites=true&w=majority";
export const client = new MongoClient(uri)



export const listAllUsers = async(client) => {
    const cursor = client.db("PEERinfo").collection("peerList").find({})
    const result = await cursor.toArray();
    return(result)
}


export const checkUserWithAccAndPass = async(client, account, password) => {
    
    const cursor = client.db("PEERinfo").collection("peerList").find({"account": account, "password": password})
    const result = await cursor.toArray();
    //console.log(result, "checkUserWithAccAndPass")
    return(result)
}



export const updateSingleUser = async(client,currentUser,newProps) => {
    let userID= ObjectId(currentUser.id)
    const result = await client.db("PEERinfo").collection("peerList").updateOne({"_id" : userID},
    {$set:newProps})
    // const result = await client.db("PEERinfo").collection("peerList").updateOne(currentUser,
    // {$set:newProps})
    console.log(result.matchedCount)
    console.log(result.modifiedCount)
}

export const createNewUser = async(client, newUser)=>{
    const result = await client.db("PEERinfo").collection("peerList").insertOne(newUser)
    return true
}


export const createNewFriendship = async(client,currentUserId,friendOfUserId)=>{
    const userID = currentUserId
    const friendID = friendOfUserId
    const user = await client.db("PEERinfo").collection("peerList").findOne({"_id":ObjectId(userID)})
    const friend = await client.db("PEERinfo").collection("peerList").findOne({"_id":ObjectId(friendID)})
    if (user && friend){
        const friendship1 = await client.db("PEERinfo").collection("peerToPeerFriendship").findOne({"peerId":userID, "friendPeerId":friendID})
        if (!friendship1){
            const result1 = await client.db("PEERinfo").collection("peerToPeerFriendship").insertOne({
                peerId : userID,
                friendPeerId : friendID
            })
        }
        const friendship2 = await client.db("PEERinfo").collection("peerToPeerFriendship").findOne({"peerId":friendID, "friendPeerId": userID})
        if (!friendship2){
            const result2 = await client.db("PEERinfo").collection("peerToPeerFriendship").insertOne({
                peerId : friendID,
                friendPeerId : userID
            })
        }
        return true
    }
    return false
}

export const getFriendListOfUser = async(client,currentUser)=>{
    const userID = currentUser.id
    const cursor = client.db("PEERinfo").collection("peerToPeerFriendship").find({peerId:userID})
    const relationshipResults = await cursor.toArray()
    // console.log(relationshipResults)
    const friendListReal = []
    const friendList = relationshipResults.map(async (element, index)=>{
        // console.log('In side map func')
        const friendPeerId = ObjectId(element.friendPeerId)
        // console.log(friendPeerId)
        const result = await client.db("PEERinfo").collection("peerList").findOne({"_id" : friendPeerId})
        //console.log(result)
        //friendListReal.push(result) //IMPORTANT
        friendListReal.push({_id: result["_id"], address : result.address, name : result.name, last_name : result.last_name, status: result.status})
        //console.log("after adding",friendListReal)
        return result
    })
    
    return Promise.all(friendList).then(()=>{ return friendListReal })
}













// export const connectAndAction= async(client,action,payload) =>{
//     try{
//         await client.connect()
//     // await createNewUser(client,{
//     //     address : "214 Ly Thuong Kiet",
//     //     name : "Lap",
//     //     last_name : "Nguyen Dinh Gia",
//     //     status : "offline"
//     // })
//     }
//     catch(e){
//         console.log(e)
//     }
//     finally{
//         await client.close()
//     }
// }