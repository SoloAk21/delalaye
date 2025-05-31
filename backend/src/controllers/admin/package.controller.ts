import { Request, Response } from "express"
import { AuthRequest } from "../../middlewares/auth";
import prisma from "../config/db";

const addPackage =async (req:AuthRequest, res:Response) => {
   
    const {name,totalDays,discount} = req.body;
    
    try {
      
     let maxLimit = ( await prisma.package.count()) == 6;
     if (maxLimit) {
       return res.status(400).json({
         errors: [{ msg: "There can only be six packages" }],
       })
     }
   const  newPackage = await prisma.package.create({
        data:{
            name:name,totalDays:Number(totalDays),discount:Number(discount)
        }
     })
     
     res.json(newPackage)
    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }
  const updatePackage =async (req:AuthRequest, res:Response) => {
    if(!Number(req.params.id)){
      return res.status(400).json({
        errors: [{ msg: "Id is required" }],
      })
    }
    const {name,totalDays,discount} = req.body;
    
    try {
   const  updatedPackage = await prisma.package.update({where:{id:Number(req.params.id)},
        data:{
            name:name,totalDays:totalDays,discount:discount
        }
     });
     
     res.json(updatedPackage);

    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }
  const updatePackageStatus =async (req:AuthRequest, res:Response) => {
    if(!Number(req.params.id)){
      return res.status(400).json({
        errors: [{ msg: "Id is required" }],
      })
    }

    try {
      let updatedPackage = await prisma.package.findUnique({where: {id: Number(req.params.id)}})
    if(!updatedPackage){
      return res.status(400).json({
        errors: [{ msg: "Package not found" }],
      })
    }
        updatedPackage = await prisma.package.update({where:{id:Number(req.params.id)},
      data:{
          status: updatedPackage.status =='INACTIVE' ? "ACTIVE":"INACTIVE"
      }
   });
   
   res.json(updatedPackage);
    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }
  const deletePackage =async (req:Request, res:Response) => {

    const id = Number(req.params.id);
      
      try {
      await prisma.package.delete({where: {id: id}})
      res.json({route:'package deleted'})
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error")
      }
    }

    const getPackages =async (req:Request, res:Response) => {
        try {
        const packages = await prisma.package.findMany();
        res.json({packages})
        } catch (err) {
          console.error(err);
          res.status(500).send("Server Error")
        }
      }
 
  export default {addPackage,deletePackage,getPackages,updatePackage,updatePackageStatus}