import prismaService from '../services/prisma.service.js';

export default class CommentRepository {
  constructor() {
    this.prismaService = prismaService;
  }

  commentSelect = {
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
    file: {
      select: {
        fileName: true,
        extension: true,
      },
    },
  };

  async create(commentDto) {
    return this.prismaService.client.comment.create({
      data: commentDto,
    });
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

  async getCountAllRootComments() {
    return this.prismaService.client.comment.count({
      where: {
        parentId: null,
      },
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
      id: 'createdAt',
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
    return this.prismaService.client.comment.findMany({
      take: limit,
      skip: offset,
      orderBy,
      select: this.commentSelect,
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
      orderBy: {
        createdAt: 'asc',
      },
      select: this.commentSelect,
    });
  }
}
