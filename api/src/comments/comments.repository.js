import prismaService from '../services/prisma.service.js';

export default class CommentRepository {
  constructor() {
    this.prismaService = prismaService;
  }

  async create(commentDto) {
    return this.prismaService.client.comment.create({
      data: commentDto,
    });
  }

  async getAllComments({ limit, offset, sortField, sortType }) {
    sortType = sortType ? sortType : 'desc';
    let orderBy = {
      id: sortType,
    };
    if (sortField !== undefined) {
      orderBy = {
        [sortField]: sortType,
      };
    }
    return this.prismaService.client.comment.findMany({
      take: limit,
      skip: offset,
      orderBy,
    });
  }
}
