import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import path from "path";
import pg from "pg";

const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"calorie_tracker",
    password:"tomattack",
    port:5432,
});

db.connect();

const __dirname = path.resolve();

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res)=>{
    res.render("homepage.ejs")
})

app.get("/add", (req, res)=>{
    res.render("add.ejs")
})

app.post("/add", async(req, res)=>{
    let food = req.body.food;
    let calorie = req.body.calorie;
    try{
        food = food.toLowerCase()
        calorie =  parseInt(calorie, 10)
        await db.query("INSERT INTO chart (food, calorie) VALUES ($1, $2)", [food,calorie])
        console.log(req.body)
        console.log(parseInt(calorie, 10))
        res.render("add.ejs", {submitStatus:"submitted"})
    }catch(err){
        console.log(err)
    }
   
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})