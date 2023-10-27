const express = require("express"); 
const app = express();
const PORT = 3200;
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const bcrypt = require('bcrypt');
const saltround = 10;
const path= require("path"); 
const session = require("express-session");
const cookieParser = require("cookie-parser");


const users =[
    { userID:'01',fullname:"neethu", email:"neethusunder18@gmail.com", password:"1234"}
]

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
    secret:"My secret",
    name:"site",
    resave:true,
    saveUninitialized:true
}))


mongoose.connect('mongodb+srv://neethu123:neethuarun123@cluster0.le6eeok.mongodb.net/?retryWrites=true&w=majority' ,{
    useNewUrlParser: true,
    useUnifiedTopology:true
})

.then((console.log("connected to mongodb")))


const postSchema = new mongoose.Schema({
    fullname: String,
    email:String,
    password:String
});

const Post = mongoose.model('Post', postSchema);

app.get('/signup', (req,res) =>{
    res.status(200).sendFile(__dirname + '/signup.html')
});

app.post('/signup', (req,res) =>{
    const{fullname,email,password} = req.body;
    bcrypt.hash(password,saltround,(err,hash) =>{


        const newPost = new Post({
            fullname: req.body.fullname,
            email:req.body.email,
            password:hash
        });
        newPost.save();

        if(err){
            res.send(err.message);
        }else{
            console.log(hash);
            res.status(303).redirect('/')
        }
    
});
});
    
    
app.get('/', (req,res) =>{

    if(req.session.isAuth){
        res.redirect('/profile');
    }else{
        res.status(200).sendFile(__dirname + '/login.html');
    }
    
});

app.post('/' , (req,res) =>{
    const{fullname,email,password}=req.body;
    const user = users.find((user) => user.fullname===fullname  && user.email ===email && user.password===password) ;

    if(!user){
        res.send("Invalid credentials");
    }else{
        req.session.userID= user.userID;
        req.session.isAuth=true;
               res.redirect('/profile')
            }
        })
      
    

app.get('/profile' , (req,res) =>{
    if(req.session.isAuth){
        res.sendFile(__dirname + '/profile.html');
    }else{
        res.redirect('/');
    }
    
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});