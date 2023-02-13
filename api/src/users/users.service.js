import UserRepository from './users.repository.js';
import TokenService from '../services/token.service.js';
export default class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.tokenService = new TokenService();
  }

  async getUser({ token }) {
    const verifyToken = await this.tokenService.validateAccessToken(token);
    if (!verifyToken) return {};
    return this.userRepository.findByEmail(verifyToken.email);
  }

  async getUserByEmail(email) {
    return this.userRepository.findByEmail(email);
  }

  async create({ username, email, homeUrl }) {
    return this.userRepository.create(username, email, homeUrl);
  }
}
