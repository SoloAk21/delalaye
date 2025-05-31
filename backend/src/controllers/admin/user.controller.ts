import { Request, Response } from "express"
import bcrypt from 'bcryptjs'
import { AuthRequest } from "../../middlewares/auth";
import { generateResetToken } from "../../utils/helpers";
import { sendPasswordResetEmail } from "../../utils/sendEmail";
import prisma from "../config/db";

const addStaff =async (req:AuthRequest, res:Response) => {
    console.log('req.body')
    console.log(req.body)
    const { fullName,email,phone,password,role,photo} = req.body;
    
    try {
     //See if user exists
     let user = await prisma.user.findUnique({where:{email}});
     if (user) {
       return res.status(400).json({
         errors: [{ msg: "user already exists" }],
       })
     }
     //Encrypt password
     const salt = await bcrypt.genSalt(10)
const hashedPassword =  await bcrypt.hash(password, salt)
     user = await prisma.user.create({
        data:{fullName:fullName,email:email,password:hashedPassword,phone:phone,photo:photo?photo:''}
     });

     res.json(user)
    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }
  const deleteStaff =async (req:Request, res:Response) => {

    const id = req.params.id;
      
      try {
      
      res.json({route:'delet users'})
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error")
      }
    }
 
  export default {addStaff,deleteStaff}