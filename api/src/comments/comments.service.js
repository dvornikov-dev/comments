import CommentRepository from './comments.repository.js';
export default class CommentService {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async create({ username, email, homeUrl, message }) {
    console.log('create', username, email, homeUrl, message);
    // валидация данных
    // каптча
    // пытаемся достать токен
    // если нет токена ищем пользователя
    // если пользователь есть возвращаем токен
    // если нет то создаем и возвращаем токен
    // создаем коммент
  }
}
