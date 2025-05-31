import { Request, Response } from "express"
import slugify from "slugify";
import { AuthRequest } from "../../middlewares/auth";
import prisma from "../config/db";
import { Prisma } from ".prisma/client";

const addService =async (req:AuthRequest, res:Response) => {
    console.log('req.body')
    console.log(req.body)
    const {name,description,serviceRate} = req.body;
    
    try {
       const slug = slugify(name)
     //See if service exists
     let slugExist = await prisma.service.findUnique({where:{slug:slug}});
     if (slugExist) {
       return res.status(400).json({
         errors: [{ msg: "This service already exists" }],
       })
     }
   const  newService = await prisma.service.create({
        data:{
            name:name,description:description,slug:slug,serviceRate:Number(serviceRate)
        }
     })
     
     res.json(newService)
    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }

  const updateService =async (req:AuthRequest, res:Response) => {
    console.log('req.body')
    console.log(req.body)
    const {name,description,serviceRate} = req.body;
    
    try {
      let service = await prisma.service.findUnique({where:{id:Number(req.params.id)}});
      if (!service) {
        return res.status(400).json({
          errors: [{ msg: "Service not found." }],
        })
      }
      if(name){
        const slug = slugify(name)
        service.name = name;
        service.slug = slug;   
      }
      if(description)service.description = description;
      if(serviceRate)service.serviceRate = Number(serviceRate);
  service = await prisma.service.update({where:{id:service.id},data:service})
     
     res.json(service)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Unique constraint violation error
        console.error("Unique constraint violation:", error.meta?.target);
     
        return res.status(400).json({
          errors: [{ msg: `Service " ${name} " already exists.` }],
        })
      } else {

        console.error(error)
        res.status(500).send("Server Error")
      }
    }
  }
  const deleteService =async (req:Request, res:Response) => {

    const id = req.params.id;
      
      try {
      
      res.json({route:'delete users'})
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error")
      }
    }

    const getServices =async (req:Request, res:Response) => {

    
        
        try {
        const services = await prisma.service.findMany();
        res.json({services})
        } catch (err) {
          console.error(err);
          res.status(500).send("Server Error")
        }
      }
 
  export default {addService,updateService,deleteService,getServices}