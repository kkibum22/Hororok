import prisma from '../../db';

class UsersService {
  async findUsers() {
    const users = await prisma.user.findMany();
    return users;
  }

  async findByUserId(userId) {
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });
    if (!user) {
      throw { status: 404, message: '해당 유저가 존재하지 않습니다.' };
    }
    return user;
  }

  async editUser(userId, editUserDto) {
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });
    if (!user) {
      throw { status: 404, message: '해당 유저가 존재하지 않습니다.' };
    }

    if (editUserDto.pw) {
      await editUserDto.updatePassword();
    }
    await prisma.user.update({
      where: { user_id: userId },
      data: {
        name: editUserDto.name,
        nickname: editUserDto.nickname,
        birth: editUserDto.birth,
        gender: editUserDto.birth,
        pw: editUserDto.pw,
      },
    });
  }
}

export default UsersService;
