const express=require("express");
const port=300;
const app=express();



app.listen(port,()=>{
    console.log(`Server is run on http://localhost:${port}/`)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
  })