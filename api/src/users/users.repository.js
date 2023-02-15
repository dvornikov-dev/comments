import prismaService from '../services/prisma.service.js';

export default class UserRepository {
  constructor() {
    this.prismaService = prismaService;
  }

  async findAll() {
    return this.prismaService.client.User.findMany();
  }

  async getUserByEmail(email) {
    return this.prismaService.client.User.findUnique({
      where: {
        email,
      },
    });
  }

  async checkUsernameAndEmail(username, email) {
    return this.prismaService.client.User.findMany({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });
  }

  async create(username, email, homeUrl) {
    return this.prismaService.client.user.create({
      data: {
        username,
        email,
        homeUrl,
      },
    });
  }
}
