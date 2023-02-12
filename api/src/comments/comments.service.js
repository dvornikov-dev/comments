import CommentRepository from './comments.repository.js';
export default class CommentService {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async create({ username, email, homeUrl, message }) {
    // каптча
    // пытаемся достать токен
    // если нет токена ищем пользователя
    // если пользователь есть возвращаем токен
    // если нет то создаем и возвращаем токен
    // создаем коммент
    const commentDto = {
      message: JSON.stringify(message),
      userId: 1,
      parentId: null,
    };

    const res = await this.commentRepository.create(commentDto);
    return res;
  }

  async getRootComments(limit, offset, sortField, sortType) {
    const commentsDto = {
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      sortField,
      sortType,
    };
    const res = await this.commentRepository.getRootComments(commentsDto);

    return { comments: res, count: res.length };
  }

  async getChildsComments(parentId) {
    const res = await this.commentRepository.getCildsComments(Number(parentId));

    return { comments: res };
  }
}
