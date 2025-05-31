import readXlsxFile from "read-excel-file/node";
import path from "path";
import bcrypt from "bcryptjs";
import prisma from "../../controllers/config/db";

type XLSXData = Array<
  [
    string,
    number
  ]
>;
const seedBrokers = async () => {
    
    const data: XLSXData = (await readXlsxFile(
        path.join(__dirname, "data.xlsx")
      )) as unknown as XLSXData;
      console.log(data.length);
      const uniquePhoneNumbers: Set<number> = new Set();
      const uniqueData: any[][] = [];
      for (let i = 1; i < data.length; i++) {
        const entry = data[i];
        const phoneNumber = entry[1];
        if (!uniquePhoneNumbers.has(phoneNumber)) {
          uniqueData.push(entry);
          uniquePhoneNumbers.add(phoneNumber);
        }
      }
      console.log(uniqueData);
      console.log(uniqueData.length);
      for (const row of uniqueData) {
        const [name, phone] = row;
        const salt = await bcrypt.genSalt(10);
      const  hashedPassword =  await bcrypt.hash('123456', salt);
      const allServices = await prisma.service.findMany()
        await prisma.broker.create({
            data: {
             fullName:name,
             phone:'+251'+phone.toString(),
             password:hashedPassword,
             photo:'',
             bio:"",
             approved:true,
             services: {
              connect: allServices.map((service) => ({ id: service.id })),
            }

            },
          });
      }

}

seedBrokers()
  .catch((e) => {
    console.error(e);
  })
  .finally( () => {
 console.log("Seed finished successfully");
  });