import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { insightValidationSchema } from 'validationSchema/insights';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getInsights();
    case 'POST':
      return createInsight();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getInsights() {
    const data = await prisma.insight
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'insight'));
    return res.status(200).json(data);
  }

  async function createInsight() {
    await insightValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.insight.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
