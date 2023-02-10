import { PrismaClient } from '@prisma/client';

class PrismaService {
  client;

  constructor() {
    this.client = new PrismaClient();
  }

  async connect() {
    try {
      await this.client.$connect();
      console.log('[PrismaService] Connected successfully');
    } catch (err) {
      console.error('[PrismaService] Error connecting to DB: ' + err.message);
    }
  }

  async disconnect() {
    await this.client.$disconnect();
  }
}

const prismaService = new PrismaService();
Object.freeze(prismaService);

export default prismaService;
