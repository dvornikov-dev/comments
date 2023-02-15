import prismaService from '../services/prisma.service.js';

export default class FileRepository {
  constructor() {
    this.prismaService = prismaService;
  }

  async addFile({ commentId, fileName, extension }) {
    return this.prismaService.client.file.create({
      data: {
        fileName,
        extension,
        commentId,
      },
    });
  }
}
