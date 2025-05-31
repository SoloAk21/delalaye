import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import axios from "axios";
import { UserRequest } from "./staff.auth";
import { imageUrlToBase64 } from "../../utils/imageToBase64";

const loginGoogle = async (req: Request, res: Response) => {
  console.log(req.body);
  const { idToken } = req.body;
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${idToken}`,
      headers: {},
    };
    const response= await axios.request(config)
    console.log(response.data)
    const {id,email,verified_email,name,given_name,family_name, picture} = response.data;
     // Function to convert an image URL to a base64-encoded string
    
let photo = await imageUrlToBase64(picture);
   let user = await prisma.user.findUnique({where:{email: email}});
   if(!user){
    user = await prisma.user.create({
      data:{
        email:email,fullName:name,photo:photo,googleId:id,password:'',phone:''
      }
    })
   }
  
  const payload = {
    user: {
      id: user.id,
    },
  };

  jwt.sign(
    payload,
    process.env.jwtSecret!,
    // { expiresIn: "7d" },
    (err, token) => {
      if (err) {
        throw err;
      }
      return res.json({ token, user,userExists: true });
    }
  );

  
  } catch (error:any) {
    if (error.code === "P2002") {
      return res.status(400).json({
        errors: [{ msg: `${error.meta.modelName} already exists` }],
      });     
    }
    res.status(500).send({ error: error });
  }
};

const signupGoogle = async (req: Request, res: Response) => {
  console.log(req.body);
  const { idToken } = req.body;
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${idToken}`,
      headers: {},
    };
    const response= await axios.request(config)
    const {id,email,verified_email,name,given_name,family_name, picture} = response.data;
   const user = await prisma.user.findUnique({where:{googleId: id}});
   let resoponse_json={};
   if (user){
    return res.status(400).json({
      errors: [{ msg: "Account with this email exist." }],
    });
   }else{
    resoponse_json= {
      id,email,verified_email,name,given_name,family_name,picture
    }
    return res.json(resoponse_json)
   }
  
  } catch (error:any) {
    if (error.code === "P2002") {
      return res.status(400).json({
        errors: [{ msg: `${error.meta.modelName} already exists` }],
      });     
    }
    res.status(500).send({ error: error });
  }
};

const signupUser = async (req: Request, res: Response) => {
  console.log(req.body);
  const { fullName,phone, email,password,googleId } = req.body;

  try {
    let user = await prisma.user.findFirst({
        where: {OR:[
          {phone: phone},
          {email: email},
        ],
      }});
    if (user) {
      return res.status(400).json({
        errors: [{ msg: "User with this phone/email already registered." }],
      });
    }
    
   
    //Encrypt password
    let hashedPassword = '';
    if(password){
      const salt = await bcrypt.genSalt(10);
      hashedPassword =  await bcrypt.hash(password, salt);
    }



         user = await prisma.user.create({
            data:{
                fullName:fullName,password:hashedPassword,phone:phone?phone:'',
                ...(googleId && { googleId: googleId }),
                ...(email && { email: email }),
            }
         })

          //Return jsonwebtoken :to login the user
  const payload = {
    user: {
      id: user.id,
    },
  };

  jwt.sign(
    payload,
    process.env.jwtSecret!,
    // { expiresIn: "7d" },
    (err, token) => {
      if (err) {
        throw err;
      }
      res.json({ token, user });
    }
  );
   
  } catch (error:any) {
    console.error(error);
    if (error.code === "P2002") {
      return res.status(400).json({
        errors: [{ msg: `${error.meta.modelName} already exists` }],
      });     
    }
    res.status(500).send("Server error");
  }
};


const loginUser = async (req: Request, res: Response) => {
  const { phone, password } = req.body;
  try {
  console.log('req.body')
  console.log(req.body)
  //See if a Building with that admin exists
  let user = await prisma.user.findUnique({where:{phone:phone}})
  if (!user) {
    return res.status(400).json({
      errors: [{ msg: "user not found" }],
    });
  }
  
  // console.log(user);
  //Check Password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      errors: [{ msg: "Password not correct." }],
    });
  }

  //Return jsonwebtoken :to login the user
  const payload = {
    user: {
      id: user.id,
    },
  };

  jwt.sign(
    payload,
    process.env.jwtSecret!,
    // { expiresIn: "7d" },
    (err, token) => {
      if (err) {
        throw err;
      }
      res.json({ token, user });
    }
  );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const getUser = async (req: UserRequest, res: Response) => {
    try {
      console.log(req.user)
      let user = await prisma.user.findUnique({where:{id:Number(req?.user?.id)}})
      res.json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  };
export default { signupUser, loginUser, loginGoogle, signupGoogle, getUser };
