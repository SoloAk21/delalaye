import { Request, Response } from "express";
import prisma from "../../config/db";
import { Prisma } from "@prisma/client";
import { CountStat } from "./dashboard.interface";
import { formattedCountData } from "./helper";

const getDashboardInfo = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalBrokers, totalConnections] = await Promise.all([
      prisma.user.count(),
      prisma.broker.count(),
      prisma.connection.count(),
    ]);
    res.json({ totalBrokers, totalUsers, totalConnections });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const getConnectionStat = async (req: Request, res: Response) => {
  const year = req.params.year;
  console.log(`year is : ${year}`);
  try {
    let brokersByMonth: CountStat[] = await prisma.$queryRaw`
          SELECT MONTH(created_at) AS month, COUNT(*) AS count
          FROM Broker
          WHERE YEAR(created_at) = ${year}
          GROUP BY MONTH(created_at)
          ORDER BY MONTH(created_at) ASC;
        `;
    brokersByMonth = brokersByMonth.map((broker: CountStat) => ({
      month: broker.month,
      count: Number(broker.count),
    }));
    let usersByMonth: CountStat[] = await prisma.$queryRaw`
        SELECT MONTH(created_at) AS month, COUNT(*) AS count
        FROM User
        WHERE YEAR(created_at) = ${year}
        GROUP BY MONTH(created_at)
        ORDER BY MONTH(created_at) ASC;
      `;
    usersByMonth = usersByMonth.map((user: CountStat) => ({
      month: user.month,
      count: Number(user.count),
    }));
    let connectionsAcceptedByMonth: CountStat[] = await prisma.$queryRaw`
      SELECT MONTH(created_at) AS month, COUNT(*) AS count
      FROM Connection
      WHERE status = 'ACCEPTED' AND YEAR(created_at) = ${year}
      GROUP BY MONTH(created_at)
      ORDER BY MONTH(created_at) 
      
      ASC;
    `;

    res.json({
      usersByMonth: formattedCountData(usersByMonth),
      brokersByMonth: formattedCountData(brokersByMonth),
      connectionsAcceptedByMonth: formattedCountData(
        connectionsAcceptedByMonth
      ),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const getServicesStat = async (req: Request, res: Response) => {
  try {
    const brokersCountByService = await prisma.service.findMany({
      include: {
        brokers: {
          select: {
            id: true,
          },
        },
      },
    });

    // Map the result to extract service names and the count of associated brokers
    const result = brokersCountByService.map((service) => ({
      serviceName: service.name,
      brokersCount: service.brokers.length,
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const getTopupStat = async (req: Request, res: Response) => {
  const year = req.params.year;
  console.log(`year is : ${year}`);
  try {
    const topupsCountByMonth: CountStat[] = await prisma.$queryRaw`
      SELECT 
        MONTH(created_at) AS month, 
        COUNT(*) AS count
      FROM Topup
      GROUP BY YEAR(created_at), MONTH(created_at)
      ORDER BY YEAR(created_at) ASC, MONTH(created_at) ASC;
    `;
    console.log(topupsCountByMonth);

    res.json({
      topupsCountByMonth: formattedCountData(topupsCountByMonth, true),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
export default {
  getDashboardInfo,
  getConnectionStat,
  getServicesStat,
  getTopupStat,
};
