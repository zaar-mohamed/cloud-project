const express=require("express")
const app=express();
app.use(express.json());
require("dotenv").config({path:"./.env"});

app.use("/taches")

const mongoose=require("mongoose")
mongoose.connect(`${process.env.URL_MONGOOSE}/${process.env.DB_NAME}`)
.then(()=> console.log(`Connected to ${process.env.DB_NAME}`))
.catch(err=> console.log(`Error Connecting: ${err}`));

const port=process.env.PORT  || 3000;
app.listen(port,()=>{
    console.log(`Listening on ${port}`)
});
