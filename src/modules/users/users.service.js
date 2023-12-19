import prisma from '../../db';

class UsersService {
  async findUsers() {
    const users = [{ id: 1, name: 'name' }];
    return users;
  }
}

export default UsersService;
