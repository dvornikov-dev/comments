import prismaService from '../services/prisma.service.js';

export class UserRepository {
    constructor() {
        this.prismaService = prismaService;
    }

    async findAll() {
        return this.prismaService.client.User.findMany();
    }
}
