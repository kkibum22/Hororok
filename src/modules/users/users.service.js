import prisma from '../../db';

class UsersService {
  async findUsers() {
    const users = prisma.user.findMany();
    return users;
  }
}

export default UsersService;
