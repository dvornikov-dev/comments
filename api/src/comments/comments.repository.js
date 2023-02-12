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

  async getRootComments({ limit, offset, sortField, sortType }) {
    const types = {
      desc: 'desc',
      asc: 'asc',
    };
    const userFields = {
      username: 'username',
      email: 'email',
    };
    const commentFileds = {
      createdAt: 'createdAt',
    };

    const sort = types[sortType] ? types[sortType] : 'desc';

    let orderBy = {
      id: sort,
    };
    if (sortField in userFields) {
      orderBy = {
        user: {
          [sortField]: sort,
        },
      };
    }

    if (sortField in commentFileds) {
      orderBy = {
        [sortField]: sort,
      };
    }
    console.log({
      take: limit,
      skip: offset,
      orderBy,
    });
    return this.prismaService.client.comment.findMany({
      take: limit,
      skip: offset,
      orderBy,
      select: {
        id: true,
        message: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            homeUrl: true,
          },
        },
      },
      where: {
        parentId: null,
      },
    });
  }

  async getCildsComments(parentId) {
    return this.prismaService.client.comment.findMany({
      where: {
        parentId,
      },
      select: {
        id: true,
        message: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            homeUrl: true,
          },
        },
      },
    });
  }
}
