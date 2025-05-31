import axios from "axios";
import { dateDifferenceInDays } from "./helpers";
import { ApprovalSms } from "./smsTemplates";

interface SmsProps {
  type: "approval" | "registration";
  phone: string;
  fullName: string;
  expireDate: Date;
}

export default async function sendSms({
  type,
  phone,
  fullName,
  expireDate,
}: SmsProps) {
  console.log("type : " + type);
  console.log("phone : " + phone);
  console.log("fullName : " + fullName);
  try {
    let message = "";

    const today = new Date();
    const specificDate = new Date(expireDate);

    const remainingDays = dateDifferenceInDays(today, specificDate);

    if (type === "approval") message = ApprovalSms(fullName, remainingDays);
    const options = {
      url: "https://api.afromessage.com/api/send",
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.MESSAGE_API_KEY}`,
      },
      body: {
        from: process.env.SENDER_ID,
        sender: "Delalaye",
        to: phone,
        message: message,
        callback: "https://api.afromessage.com/api/challenge",
      },
    };

    const response = await axios.post(options.url, options.body, {
      headers: options.headers,
    });
    // console.log(response)
  } catch (error) {
    console.log(error);
  }
}
interface PasswordResetSmsProps {
  phone: string;
  otp: string;
}
export async function sendPasswordResetSms({
  phone,
  otp,
}: PasswordResetSmsProps) {
  try {
    let message = `${otp} is your password reset code.`;
    const options = {
      url: "https://api.afromessage.com/api/send",
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.MESSAGE_API_KEY}`,
      },
      body: {
        from: process.env.SENDER_ID,
        sender: "Delalaye",
        to: phone,
        message: message,
        callback: "https://api.afromessage.com/api/challenge",
      },
    };

    const response = await axios.post(options.url, options.body, {
      headers: options.headers,
    });
    // console.log(response)
  } catch (error) {
    console.log(error);
  }
}
interface CustomSmsProps {
  phone: string;
  msg: string;
}
export async function sendCustomSms({ phone, msg }: CustomSmsProps) {
  try {
    let message = msg;

    const options = {
      url: "https://api.afromessage.com/api/send",
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.MESSAGE_API_KEY}`,
      },
      body: {
        from: process.env.SENDER_ID,
        sender: "Delalaye",
        to: phone,
        message: message,
        callback: "https://api.afromessage.com/api/challenge",
      },
    };

    const response = await axios.post(options.url, options.body, {
      headers: options.headers,
    });
  } catch (error) {
    console.log(error);
  }
}

interface BulkSmsProps {
  to: string[];
  message: string;
}

export async function sendBulkSms({ to, message }: BulkSmsProps) {
  try {
    const options = {
      url: "https://api.afromessage.com/api/bulk_send",
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.MESSAGE_API_KEY}`,
      },
      body: {
        from: process.env.SENDER_ID,
        sender: "Delalaye",
        to,
        message,
        callback: "https://api.afromessage.com/api/challenge",
      },
    };
    // {
    //     "campaign":"YOUR_CAMPAIGN_NAME",
    //     "createCallback":"YOUR_CREATE_CALLBACK For campaign action",
    //     "statusCallback":"YOUR_STATUS_CALLBACK For message status"
    // }

    const response = await axios.post(options.url, options.body, {
      headers: options.headers,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
