const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')

// middleware 
app.use(cors())
app.use(express.json())

require('dotenv').config()





const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.hcgdznz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {

  try {
    
   const userinfoCollection = client.db("ibosTaskManagement").collection("userinfo")
   const taskCreationCollection = client.db("ibosTaskManagement").collection("taskCreation")
   



   app.post("/userinfo", async (req, res) => {
       const userinfo = req.body
       const result= await userinfoCollection.insertOne(userinfo)
       res.send(result)
   })

   app.post("/taskCreation", async (req, res) => {
       const taskinfo = req.body 
       console.log(taskinfo)
       const result = await taskCreationCollection.insertOne(taskinfo)
       res.send(result)
   })

   app.get("/user", async (req, res) => {
       const filter = { }
       const alluser = await userinfoCollection.find(filter).toArray()
       res.send(alluser)
   })


   

  // team add and update 
  app.patch("/teamadd/:id", async (req, res) => {
      const body = req.body
      console.log(body)
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const update ={$set: {
        admin:body.admin,
        status:body.status
      } }

      const result = await userinfoCollection.updateOne(filter, update)
      res.send(result)
  })



  // team member remove 
  app.patch("/teamMemberRemove/:id", async(req, res) => {
      const id = req.params.id 
      const filter = {_id: new ObjectId(id)}
      const body = req.body.status
      const update = {$set: {
        admin:" ",
        status:body
      }}
      console.log(update)
      const result = await userinfoCollection.updateOne(filter, update)
      res.send(result)
  })




  app.get("/member/:email", async (req, res) => {
      const email = req.params.email
      const filter = {admin:email, status:true}
      const member = await userinfoCollection.find(filter).toArray()
      res.send(member)
  })



  // get all team task 
  app.get("/teamtaskview", async (req, res) => {
      const filter = {}
      const result = await taskCreationCollection.find(filter).toArray()
      res.send(result)
  })


  app.delete("/taskDelete/:id", async (req, res) => {
     const id = req.params.id
     const filter = {_id: new ObjectId(id)}
     const result = await taskCreationCollection.deleteOne(filter)
     res.send(result)
  })






  } finally {
    // Ensures that the client will close when you finish/error
   
  }
}
run().catch(console.dir);











app.get('/', (req, res) => {
  res.send('Task management app server runing!')
})

app.listen(port, () => {
  console.log(`Task management app ${port}`)
})