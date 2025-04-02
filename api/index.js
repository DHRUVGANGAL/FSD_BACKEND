// const express = require('express');
// const app = express();
// app.use(express.json());

// const fs = require('fs/promises');

// let jsonData;

// fs.readFile('data.json', 'utf8', (err, data) => {
//   if (err) throw err;
//   jsonData = JSON.parse(data);
//   console.log(jsonData);
// });


// app.get("/GetValue",function(req,res){
      
//     res.status(200).send({jsonData});
//     console.log("Value set successfully!");
// })


// app.post('/append-data', async (req, res) => {
//     try {
//       const newData = req.body;
//       const filePath = 'data.json';
      
//       let dataArray = [];
      
//       try {
       
//         const fileData = await fs.readFile(filePath, 'utf8');
//         dataArray = JSON.parse(fileData);
        
        
//       } catch (err) {
        
//         dataArray = [];
//       }
      
       
//       dataArray.push(newData);
      
      
//       await fs.writeFile(filePath, JSON.stringify(dataArray, null, 2));
      
//       res.status(200).json({ 
//         success: true, 
//         message: 'Data successfully appended', 
//         data: newData 
//       });
//     } catch (error) {
//       console.error('Error appending data:', error);
//       res.status(500).json({ 
//         success: false, 
//         message: 'Error appending data', 
//         error: error.message 
//       });
//     }
//   });
  



//  app.listen(3000);



const express = require('express')

const cors = require('cors')
const fs= require('fs/promises')
const app = express()
let users =[];
app.use(express.json())
app.use(cors())
console.log(users);
const readdata = async () => {
    try {
      const data = await fs.readFile('./data.json', 'utf8');
      // Check if the file is empty or only contains whitespace
      if (!data || data.trim() === '') {
        users = []; // Initialize with empty array if file is empty
      } else {
        users = JSON.parse(data);
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist yet, create it with an empty array
        await fs.writeFile('./data.json', JSON.stringify([]));
        users = [];
      } else {
        console.error('Error reading data file:', error);
        users = []; // Fallback to empty array
      }
    }
  };
const writedata=async ()=>{
   await fs.writeFile('./data.json',JSON.stringify(users))
}
readdata();
app.get('/getdata', async (req, res) => {
    res.json(users);
})
app.post('/users',(req,res)=>{
    const {name,age}=req.body;
    const newid=users.length>0?users[users.length-1].id+1:1;
    const newuser={id:newid,name,age};
    users.push(newuser);
    writedata();
    res.status(200).json({message: 'user register success',data: newuser});
    
})
app.put('/users/:id/',(req,res) => {
    const uid=req.params.id;
    const {name,age}=req.body;
    const userIndex=users.findIndex(user=>user.id==uid);
    if(!name || !age) {
        res.status(400).json({message: 'name and age are required'});
        return;
    }
    if(userIndex==-1){
        console.log(userIndex)
        res.status(404).json({message: 'user not found'});
    }
    else{
        users[userIndex].name=name;
        users[userIndex].age=age;
        writedata();
        res.status(200).json({message: 'user updated successfully',data: users[userIndex]});
    }  
})

app.delete('/users/:id',(req,res) => {
    const uid=req.params.id;
    const userIndex=users.findIndex(user=>user.id==uid);
    if(userIndex==-1){
        res.status(404).json({message: 'user not found'});
    }
    else{
        users.splice(userIndex,1);
        writedata();
        res.status(200).json({message: 'user deleted successfully',data: users[userIndex]});
    }  
})

app.listen(3000);

module.exports = app;