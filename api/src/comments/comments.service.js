import CommentRepository from './comments.repository.js';
import UserService from './../users/users.service.js';
import TokenService from '../services/token.service.js';
import FileService from '../services/file.service.js';
import ApiExeption from '../exeptions/api.exeption.js';

export default class CommentService {
  constructor(cache, eventEmitter, fileQueue) {
    this.commentRepository = new CommentRepository();
    this.userService = new UserService();
    this.tokenService = new TokenService();
    this.fileService = new FileService();
    this.cache = cache;
    this.eventEmitter = eventEmitter;
    this.fileQueue = fileQueue;

    this.eventEmitter.on('commentsUpdated', () => {
      this.cache.flushAll();
    });
  }

  async create({ username, email, homeUrl, message, parentId, file }) {
    // каптча
    let userId;
    const candidate = await this.userService.getUserByEmail(email);
    if (candidate && candidate.username === username) {
      userId = candidate.id;
    } else {
      const checkUsernameAndEmail =
        await this.userService.checkUsernameAndEmail(username, email);
      if (checkUsernameAndEmail) {
        throw ApiExeption.BadRequest('Username or email is already in use', {
          message: 'Username or email is already in use',
        });
      }
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
    if (res) {
      this.eventEmitter.emit('commentsUpdated');
    }
    if (file.success) {
      file.commentId = res.id;
      this.fileQueue.add('processFile', { file });
    }

    return { success: true, accessToken: jwt.accessToken };
  }

  async getRootComments(limit, offset, sortField, sortType) {
    const cacheKey = `query:${limit}:${offset}:${sortField}:${sortType}`;
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    } else {
      const commentsDto = {
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        sortField,
        sortType,
      };
      const res = await this.commentRepository.getRootComments(commentsDto);
      const count = await this.commentRepository.getCountAllRootComments();
      this.cache.set(cacheKey, { comments: res, count });
      return { comments: res, count };
    }
  }

  async getChildsComments(parentId) {
    const cacheKey = `query:${parentId}}`;
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    } else {
      const res = await this.commentRepository.getCildsComments(
        Number(parentId),
      );
      this.cache.set(cacheKey, { comments: res });
      return { comments: res };
    }
  }
}
