const mongoose=require("mongoose")
const connectDb=async()=>{
  try {
    const connect=await mongoose.connect(process.env.CONNECTION_STRING)

    
    console.log("MongoDB Connected...",connect.connection.name,connect.connection.host)
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    process.exit(1)
  }
}

module.exports=connectDb