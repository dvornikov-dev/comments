import UserRepository from './users.repository.js';
export default class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUsers() {
    return this.userRepository.findAll();
  }
}
