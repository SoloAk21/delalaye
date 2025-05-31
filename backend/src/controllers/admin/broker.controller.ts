import { Request, Response } from "express"
import { AuthRequest } from "../../middlewares/auth";
import sendEmail from "../../utils/sendEmail";
import prisma from "../config/db";
import sendSms from "../../utils/sendSms";
import { Prisma } from ".prisma/client";

const addBroker =async (req:AuthRequest, res:Response) => {
    console.log('req.body')
    console.log(req.body)
    const { account,fullname,email,phone,password} = req.body
    
    try {
    
      res.json({route:'update account'})
    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }
  const addService =async (req:AuthRequest, res:Response) => {
    console.log('req.body')
    console.log(req.body)
    const { account,fullname,email,phone,password,selectedServices} = req.body
    
    try {
    
      res.json({route:'update account'})
    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }
  const updateBroker =async (req:AuthRequest, res:Response) => {
   
    try {
      console.log('req.body')
      console.log(req.body)
      const { fullName,email,phone,selectedServices} = req.body
      let broker:any = await prisma.broker.findUnique({where:{id:Number(req.params.id)},include:{services:true}});
      if (!broker) {
        return res.status(400).json({
          errors: [{ msg: "Broker not found." }],
        })
      }
      const existingServiceIds = broker.services.map((service: { id: any; })=>({id:service.id}));
      const removedServices = existingServiceIds.filter((service: { id: any; })=>!selectedServices.includes(service.id))
      if(fullName) broker.fullName = fullName;
      if(email) broker.email = email;
      if(phone) broker.phone = phone;
      if(selectedServices) {
        broker = await prisma.broker.update({where:{id:broker.id},data:{
          ...broker,
          services:{
           connect: selectedServices.map((service: any)=> ({id:service})),
           disconnect: removedServices
          }
        }})
      }
      broker = await prisma.broker.update({where:{id:broker.id},data:broker,include:{services:true}})
      res.json(broker)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Unique constraint violation error
        console.error("Unique constraint violation:", error.meta?.target);
        console.log(typeof error.meta?.target)
        const constraint:string = error.meta?.target as string
        let variable = '';
        if(constraint.indexOf('phone') !== -1)  variable='Phone number'
        if(constraint.indexOf('email') !== -1)  variable= 'Email'
        return res.status(400).json({
          errors: [{ msg: `${variable} already exists.` }],
        })
      } else {

        console.error(error)
        res.status(500).send("Server Error")
      }
    }
  }
  const updateBrokerPhoto =async (req:AuthRequest, res:Response) => {
   
    try {
      console.log(req.body)
      const { photo} = req.body
      let broker = await prisma.broker.findUnique({where:{id:Number(req.params.id)}});
      if (!broker) {
        return res.status(400).json({
          errors: [{ msg: "Broker not found." }],
        })  
      }
      broker = await prisma.broker.update({where:{id:broker.id},data:{
        photo:photo
      }})
      res.json({route:'update account'})
    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }
  const approveBroker =async (req:AuthRequest, res:Response) => {
   
    
    try {
      console.log('req.params.id')
      console.log(req.params.id)
      if(!Number(req.params.id)){
        return res.status(400).json({
          errors: [{ msg: "Broker not found." }],
        }) 
      }
      let broker = await prisma.broker.findUnique({where:{id:Number(req.params.id)}});
      if (!broker) {
        return res.status(400).json({
          errors: [{ msg: "Broker not found." }],
        })  
      }
      const currentDate = new Date();
      const serviceExprireDate = new Date(currentDate.setDate(currentDate.getDate() + 14));
      broker = await prisma.broker.update({where: {id:Number(req.params.id)},data:{
        approved:true,
        approvedDate:new Date(),
        serviceExprireDate
      },include:{services:true}});

      if(broker.phone){
        sendSms({type:'approval',phone:broker.phone,fullName:broker.fullName,expireDate:broker.serviceExprireDate});
      }
      if(broker.email){
        sendEmail({type:'approval',email:broker.email,fullName:broker.fullName});
      }
      res.json({broker})
    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }
  const deleteBroker =async (req:Request, res:Response) => {

    const id = Number(req.params.id);
      
      try {
        const deletedUser = await prisma.broker.delete({
          where: {
            id: id,
          },
        });
      res.json({msg:'user deleted',deletedUser });
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error")
      }
    }
  const getAllBrokers =async (req:AuthRequest, res:Response) => {
    // const page = req.query._page as unknown as number;
    // const limit = req.query._limit as unknown as number;
    const page: number = parseInt(req.query._page as string) || 1;
  const limit: number = parseInt(req.query._limit as string) || 10;
    const skip = (page - 1) * limit;
    try {
      const approvedBrokers  = await prisma.broker.findMany({where:{approved:true},include:{services:true},skip,take:limit});
      const totalCount = await prisma.broker.count(); 
    // const [approvedBrokers,notapprovedBrokers] =  await Promise.all([prisma.broker.findMany({where:{approved:true},include:{services:true},skip,take:limit}),prisma.broker.findMany({where:{approved:false},include:{services:true}})]); 
      res.json({approvedBrokers,page,
        limit,
        total:totalCount,});
    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }
  const getApprovedBrokers =async (req:AuthRequest, res:Response) => {
    const page: number = parseInt(req.query._page as string) || 1;
  const limit: number = parseInt(req.query._limit as string) || 10;
    const skip = (page - 1) * limit;
    try {
      const approvedBrokers  = await prisma.broker.findMany({where:{approved:true},include:{services:true},skip,take:limit});
      const totalCount = await prisma.broker.count({where:{approved:true}}); 
  
      res.json({approvedBrokers,page,
        limit,
        total:totalCount,});
    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }
  const getRegisteredBrokers =async (req:AuthRequest, res:Response) => {
    const page: number = parseInt(req.query._page as string) || 1;
  const limit: number = parseInt(req.query._limit as string) || 10;
    const skip = (page - 1) * limit;
    try {
      const notapprovedBrokers  = await prisma.broker.findMany({where:{approved:false},include:{services:true},skip,take:limit});
      const totalCount = await prisma.broker.count({where:{approved:false}}); 
  console.log('totalCount')
  console.log(totalCount)
      res.json({notapprovedBrokers,page,
        limit,
        total:totalCount,});
    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }
  const searchApprovedBrokers =async (req:AuthRequest, res:Response) => {
    const page: number = parseInt(req.query._page as string) || 1;
  const limit: number = parseInt(req.query._limit as string) || 10;
  const skip = (page - 1) * limit;
  const search: string = req.query.search as string || '';
  const searchBy: string = req.query.searchBy as string || '';
  if (!search) {
    return res.status(400).json({
      errors: [{ msg: 'Search parameter "search" is required' }],
    }) 
}
if (!searchBy) {
  return res.status(400).json({
    errors: [{ msg: '"searchBy" parameter is required' }],
  }) 
}
    try {
      const approvedBrokers  = await prisma.broker.findMany({where:{approved:true,
        fullName: {
          contains: search,
      }
      },include:{services:true},skip,take:limit});
      const totalCount = await prisma.broker.count({where:{approved:true,fullName: {
        contains: search,
    }}}); 
  
      res.json({approvedBrokers,page,
        limit,
        total:totalCount,});
    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }
  const searchRegisteredBrokers =async (req:AuthRequest, res:Response) => {
    const page: number = parseInt(req.query._page as string) || 1;
  const limit: number = parseInt(req.query._limit as string) || 10;
  const skip = (page - 1) * limit;
  const search: string = req.query.search as string || '';
  const searchBy: string = req.query.searchBy as string || '';
  if (!search) {
    return res.status(400).json({
      errors: [{ msg: 'Search parameter "search" is required' }],
    }) 
}
if (!searchBy) {
  return res.status(400).json({
    errors: [{ msg: '"searchBy" parameter is required' }],
  }) 
}
    try {
      const notapprovedBrokers  = await prisma.broker.findMany({where:{approved:false,
        fullName: {
          contains: search,
      }
      },include:{services:true},skip,take:limit});
      const totalCount = await prisma.broker.count({where:{approved:false,fullName: {
        contains: search,
    }}}); 
  
      res.json({notapprovedBrokers,page,
        limit,
        total:totalCount,});
    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }
  export default {addBroker,addService,deleteBroker,updateBroker,updateBrokerPhoto,approveBroker,getAllBrokers,getApprovedBrokers,getRegisteredBrokers,searchApprovedBrokers,searchRegisteredBrokers}