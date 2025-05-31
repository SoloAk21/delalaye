import { Request, Response } from "express"
import bcrypt from 'bcryptjs'
import { AuthRequest } from "../../middlewares/auth";
import prisma from "../config/db";

const addStaff =async (req:AuthRequest, res:Response) => {
    console.log('req.body')
    console.log(req.body)
    const { fullName,email,phone,password,role,photo} = req.body;
    
    try {
     //See if user exists
     let user = await prisma.staff.findUnique({where:{email}});
     if (user) {
       return res.status(400).json({
         errors: [{ msg: "Staff with this email exists" }],
       })
     }
     user = await prisma.staff.findUnique({where:{phone}});
     if (user) {
       return res.status(400).json({
         errors: [{ msg: "Staff with this phone exists" }],
       })
     }
     //Encrypt password
     const salt = await bcrypt.genSalt(10)
const hashedPassword =  await bcrypt.hash(password, salt)
     user = await prisma.staff.create({
        data:{
            fullName:fullName,email:email,role:role,password:hashedPassword,phone:phone,photo:photo?photo:''
        }
     })
     
     res.json(user)
    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }

  const updateStaff =async (req:AuthRequest, res:Response) => {
    console.log('req.body')
    console.log(req.body)
    const { fullName,email,phone,password,role} = req.body;
    
    try {
     //See if user exists
     let staff = await prisma.staff.findUnique({where:{id:Number(req.params.id)}});
     if (!staff) {
       return res.status(400).json({
         errors: [{ msg: "Staff not found" }],
       })
     }
     if(password){
       //Encrypt password
       const salt = await bcrypt.genSalt(10)
  const hashedPassword =  await bcrypt.hash(password, salt)
staff.password = hashedPassword;
     }
  if(fullName)staff.fullName = fullName;
  if(email)staff.email = email;
  if(phone)staff.phone = phone;
  if(role)staff.role = role;
     staff = await prisma.staff.update({where:{id:staff.id},data:staff})
     res.json(staff)
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

    const getStaffs =async (req:Request, res:Response) => {

    
        
      try {
      const staffs = await prisma.staff.findMany();
      res.json({staffs})
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error")
      }
    }
 
  export default {addStaff,updateStaff,deleteStaff,getStaffs}