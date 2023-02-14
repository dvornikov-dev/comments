import prismaService from '../services/prisma.service.js';

export default class UserRepository {
  constructor() {
    this.prismaService = prismaService;
  }

  async save({ text }) {
    return this.prismaService.client.captcha.create({
      data: {
        text,
      },
    });
  }

  async findById(id) {
    return this.prismaService.client.captcha.findUnique({
      where: {
        id,
      },
    });
  }
}
