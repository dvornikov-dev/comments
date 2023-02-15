import CommentRepository from './comments.repository.js';
import UserService from './../users/users.service.js';
import TokenService from '../services/token.service.js';
import FileService from '../services/file.service.js';

export default class CommentService {
  constructor() {
    this.commentRepository = new CommentRepository();
    this.userService = new UserService();
    this.tokenService = new TokenService();
    this.fileService = new FileService();
  }

  async create({ username, email, homeUrl, message, parentId, file }) {
    // каптча
    let userId;
    const candidate = await this.userService.getUserByEmail(email);
    if (candidate) {
      userId = candidate.id;
    } else {
      const user = await this.userService.create({ username, email, homeUrl });
      userId = user.id;
    }

    const jwt = await this.tokenService.generateToken({
      username,
      email,
      homeUrl,
    });

    const commentDto = {
      message: JSON.stringify(message),
      userId,
      parentId,
    };

    const res = await this.commentRepository.create(commentDto);
    if (file) {
      const fileObj = await this.fileService.saveFile(
        file.file,
        file.extension,
      );
      const fileModel = await this.commentRepository.addFile({
        commentId: res.id,
        ...fileObj,
      });
    }

    return { success: true, accessToken: jwt.accessToken };
  }

  async getRootComments(limit, offset, sortField, sortType) {
    const commentsDto = {
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      sortField,
      sortType,
    };
    const res = await this.commentRepository.getRootComments(commentsDto);
    const count = await this.commentRepository.getCountAllRootComments();
    return { comments: res, count };
  }

  async getChildsComments(parentId) {
    const res = await this.commentRepository.getCildsComments(Number(parentId));

    return { comments: res };
  }
}
