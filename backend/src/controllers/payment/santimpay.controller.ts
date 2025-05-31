import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/db";
import crypto from "crypto";
import { sendCustomSms } from "../../utils/sendSms";

const notify = async (req: Request, res: Response) => {
  console.log(`req.body`);
  console.log(req.body);
  const {
    txnId,
    refId,
    paymentVia,
    Status,
    amount,
    currency,
    reason,
    thirdPartyId,
  } = await req.body;
  // FAILED
  // COMPLETED
  try {
    console.log("Got here on notify controller");
    // const hash = crypto.createHmac('sha256', process.env.CHAPA_SECRET_HASH!).update(JSON.stringify(req.body)).digest('hex');
    // if (hash == req.headers['signedToken']) {
    //   }else{
    //           console.log('not from chapa')
    //          }
    if (Status === "COMPLETED") {
      const topUp = await prisma.topup.findUnique({
        where: { tx_ref: thirdPartyId },
        include: { package: true },
      });
      if (topUp) {
        const broker = await prisma.broker.findUnique({
          where: { id: topUp.brokerId },
        });
        if (broker) {
          const currentDate: Date = new Date();
          let serviceExprireDate: Date = new Date(broker.serviceExprireDate);
          console.log(`Previous serviceExprireDate: ${serviceExprireDate}`);

          if (serviceExprireDate.getTime() > currentDate.getTime()) {
            console.log("account not expired");
            serviceExprireDate.setDate(
              serviceExprireDate.getDate() + topUp.package.totalDays
            );
          } else {
            console.log("account expired");
            currentDate.setDate(
              currentDate.getDate() + topUp.package.totalDays
            );
            serviceExprireDate = currentDate;
          }
          console.log(`serviceExprireDate: ${serviceExprireDate}`);
          const updatedBroker = await prisma.broker.update({
            where: { id: broker.id },
            data: { serviceExprireDate },
          });
          sendCustomSms({
            phone: updatedBroker.phone,
            msg: `ውድ ደንበኛችን በጥያቄዎ መሰረት የ ${
              topUp.package.name
            } ክፍያዎ ተቀባይ ሆኗል። በዚህ መሰረት እስከ ${updatedBroker.serviceExprireDate.toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            )} ድረስ ያለገደብ መጠቀም ይችላሉ።

እናመሰናለን።`,
          });
        }
      }
    }

    res.json({ msg: "Recieved." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export default { notify };
