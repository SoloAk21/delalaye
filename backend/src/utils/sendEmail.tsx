
import React from "react";
import nodemailer from "nodemailer"
import { render } from "@react-email/render";
import ApprovalEmail, { PasswordResetEmail,  
  // ReinviteEmail,
  //  SorryEmail 
} from "./Email";

export interface User {
  _id:string,
  fullname:string,
  account:{
    cbe:string,
    awash:string,
    coop:string
  }
}

interface EmailProps {
  type:'approval'|'registration',email:string,fullName:string
}

     export default async function sendEmail({email,fullName,type}:EmailProps) {
     
    
let emailHtml = render(<ApprovalEmail fullName={fullName}/>);
let emailSubject ="Registered successfully"
        
         let transporter = nodemailer.createTransport({
           host: "mail.delalaye.com",
           port: 465,
           secure: true, // true for 465, false for other ports
           auth: {
             user: process.env.EMAIL_USERNAME, // generated ethereal user
             pass: process.env.EMAIL_PASSWORD, // generated ethereal password
           },
         })  
         // send mail with defined transport object
         let info = await transporter.sendMail({
           from: `"Delalaye" <support@delalaye.com>`, // sender address
           to: email, // list of receivers
           subject: emailSubject, // Subject line
           text: `text msg`, // plain text body
           html: emailHtml, // html body
         })
         console.log("Message sent: %s", info.messageId)
         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
 
         // Preview only available when sending through an Ethereal account
         console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
     }
     export  async function sendPasswordResetEmail(email:string,userName:string,link:string,expirationDate:Date) {
      
      let emailHtml = render(<PasswordResetEmail  userName={userName!} link={link} expirationDate={expirationDate}/>);
         let transporter = nodemailer.createTransport({
           host: "mail.delalaye.com",
           port: 465,
           secure: true, // true for 465, false for other ports
           auth: {
             user: process.env.EMAIL_USERNAME, // generated ethereal user
             pass: process.env.EMAIL_PASSWORD, // generated ethereal password
           },
         })
         // send mail with defined transport object
         let info = await transporter.sendMail({
           from: `"Delalaye" <support@delalaye.com>`, // sender address
           to: email, // list of receivers
           subject: 'Delalaye Password reset.', // Subject line
           text: `text msg`, // plain text body
           html: emailHtml, // html body
         })
         console.log("Message sent: %s", info.messageId)
         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
 
         // Preview only available when sending through an Ethereal account
         console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
     }
        