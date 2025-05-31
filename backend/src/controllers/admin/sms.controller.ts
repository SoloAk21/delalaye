import { Request, Response } from "express"
import prisma from "../config/db";
import { Prisma } from ".prisma/client";
import { sendBulkSms } from "../../utils/sendSms";

const sendSms =async (req:Request, res:Response) => {
    console.log('req.body')
    console.log(req.body)
    try {
        const {to,services,message} = req.body;
        const availableReciients =['brokers','users']
        if(!availableReciients.includes(to)){
            return res.status(400).json({
                errors: [{ msg: "Recipients can only be brokers or users." }],
              })
        }

        let userPhoneNumbers:string[]=[];
        let brokerPhoneNumbers:string[]=[];
        let brokers;
        let users;
        if(to==='brokers'){
            if(services){
                brokers = await prisma.broker.findMany({
                    where: {
                        services: {
                            some: { id: {in: services}}
                        },
                    },
                    include: {
                        services: true,
                    },
                });
                brokerPhoneNumbers = brokers.map(broker=>broker.phone)
            } else{

                brokers= await prisma.broker.findMany({});
                brokerPhoneNumbers = brokers.map(broker=>broker.phone)

            }
           const smsRes = await sendBulkSms({to:brokerPhoneNumbers,message})
           console.log(smsRes)
           if(smsRes.acknowledge=='success'){
             return res.json({msg:'Sent successfully!'})
           }
           if(smsRes.acknowledge=='error') {
            return res.status(400).json({
                errors: smsRes.response.errors.map((error: any)=>({ msg: error })) ,
              })
          }
        }
        if(to==='users'){
            

                users= await prisma.user.findMany({
                  where:{
                    NOT:{phone:null}
                  }
                });
                userPhoneNumbers = users.map(user=>user.phone!)

            
           const smsRes = await sendBulkSms({to:userPhoneNumbers,message})
           console.log(smsRes)
           if(smsRes.acknowledge=='success'){
             return res.json({msg:'Sent successfully!'})
           }
           if(smsRes.acknowledge=='error') {
            return res.status(400).json({
                errors: smsRes.response.errors.map((error: any)=>({ msg: error })) ,
              })
          }
        }
     
    } catch (err) {
      console.error(err)
      res.status(500).send("Server Error")
    }
  }

 
  export default {sendSms}