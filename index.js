const { fileLoader } = require('ejs');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    fs.readdir("./files",(err, files) => {
        // console.log(files);
        err ? next(err): res.render("index", {files})
    })
})

app.get("/delete/:filename",(req,res,next)=>{
    const filee  = req.params.filename;
    fs.unlink(`./files/${filee}`,(err)=>{
        err ? next(err) :  res.redirect("/");
    })
  
})

app.get("/create",(req,res,next)=>{
    res.render("khatadata");
})
app.post("/khatadata/create",(req,res,next)=>{
    const data = req.body.info;
    const date = new Date();
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();
    const sec = date.getSeconds();
    const min = date.getMinutes();
    const fullDate = `${day}-${month}-${year}_${min}_${sec}_.txt`
  

    fs.writeFile(`./files/${fullDate}`,data,(err)=>{
        err ? next(err) : console.log("created...");
    })
    res.redirect("/")
   

    
})
app.get("/read/:filename",(req,res,next)=>{
    const filee  = req.params.filename;
    fs.readFile(`./files/${filee}`,(err,data)=>{
        err ? next(err) :  res.render("read",{data});
    })
  
})
app.get("/edit/:filename",(req,res,next)=>{
    fs.readFile(`./files/${req.params.filename}`,'utf8',(err,data)=>{
        err ? next(err) : res.render("edit",{data,filename: req.params.filename});
    })
})
app.post("/update/:filename",(req,res,next)=>{

    fs.writeFile(`./files/${req.params.filename}`,req.body.info,(err)=>{
        err ? next(err) : res.redirect("/");
    })
    
})
app.use((err,req,res,next)=>{
    res.send("This is a Error :: " + err);
})

app.listen(3000);
