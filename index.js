const { MongoClient, ServerApiVersion } = require('mongodb');
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
   const teamCreationCollection = client.db("ibosTaskManagement").collection("teamCreation")



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


   app.post("/teamadd", async (req, res) => {
      const teamData = req.body
      const teamadd = await teamCreationCollection.insertOne(teamData)
      res.send(teamData)
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