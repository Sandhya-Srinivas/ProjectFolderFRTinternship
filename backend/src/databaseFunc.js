const { MongoClient, ObjectId } = require('mongodb')

require("dotenv").config()

const URI = process.env.COSMOS_MONGO_URL

const main= async(action)=>{
    const client = new MongoClient(URI, {useUnifiedTopology: true})
    try{
        await client.connect()
        if(action.type == "update"){
            await updateData(client, action.data, action.deletedIds)
        }
        const data = await fetchData(client, action.userId)
        // console.log(data)
        return {data: data, isValid: true}
    }catch(err){
        console.log('Connection error: ', err)
        return {error: "Database error", isValid: false}
    }finally{
        await client.close()
        console.log("connected")
    }
}


const fetchData= async(client, userId)=>{
    
    const todoCollection = await client.db("TodoList").collection("TodoCollection")
    const cursor = await todoCollection.find({userId: userId}).toArray()
    return cursor
}


// does delete, update(one-edit or many-save changes), insert(add)
const updateData = async(client, data, deletedIds)=>{
    const todoCollection = await client.db("TodoList").collection("TodoCollection")
    console.log('in db, ', deletedIds)
    deletedIds.forEach(async(id)=>{
        const res = await todoCollection.deleteOne({_id: new ObjectId(id)})
        console.log('Deleted: ', res)
    })
    data.forEach(async(todo)=>{
        const result = await todoCollection.updateOne({_id: new ObjectId(todo._id)}, {$set: {name: todo.name, desc: todo.desc, done: todo.done, userId: todo.userId}}, {upsert: true})
        console.log('Updated: ', result)
    })
}

module.exports = {main}
