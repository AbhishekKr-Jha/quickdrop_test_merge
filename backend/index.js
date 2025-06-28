import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express'
import nodemailer from 'nodemailer';
import router from './routes/router.js'
import cors from 'cors'
import { S3Client } from '@aws-sdk/client-s3';


const app = express()

 

app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true }));


app.use(cors({
    origin:[ 'http://localhost:5173','https://quickdrop-v01.vercel.app','http://35.168.255.87:5173' ],
    credentials: true,             
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  }));

app.use ( '/api/v1',router)


export const env_variables=()=>{
const smtpUser=process.env.SMTP_USER
const smtpPassword=process.env.SMTP_PASSWORD

const awsRegion=process.env.AWS_REGION
const awsAccessKey=process.env.AWS_ACCESS_KEY
const awsSecretKey=process.env.AWS_SECRET_KEY
return {awsRegion,awsAccessKey,awsSecretKey,smtpUser,smtpPassword}
}

const dot_env=env_variables()

// console.log(env_variables.smtpPassword)
 

// ----
export const s3ClientAws=new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY , 
        secretAccessKey:process.env.AWS_SECRET_KEY
   
    }
})
// ----- 
 export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", 
  port: 587,
  secure: false,     
  auth: {
    // user:process.env.SMTP_USER ,
    // pass:process.env.SMTP_PASSWORD
    user: dot_env.smtpUser,
    pass:dot_env.smtpPassword
  },
}); 

app.get('/', (req, res) => {
    res.send('this is index.js') 
  })

app.listen(process.env.PORT || 3000,()=>console.log("hello the web is running on port") )   