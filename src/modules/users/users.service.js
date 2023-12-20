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

  async deleteUser(userId) {
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });
    if (!user) {
      throw { status: 404, message: '해당 유저가 존재하지 않습니다.' };
    }

    await prisma.user.delete({
      where: {
        user_id: userId,
      },
    });
  }

  async findFollowersById(userId) {
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        follwers: {
          include: {
            from_user: true,
          },
        },
      },
    });
    if (!user) {
      throw { status: 404, message: '해당 유저가 존재하지 않습니다.' };
    }

    return user.follwers.map((user) => user.from_user);
  }

  async findFollowingById(userId) {
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        following: {
          include: {
            to_user: true,
          },
        },
      },
    });
    if (!user) {
      throw { status: 404, message: '해당 유저가 존재하지 않습니다.' };
    }

    return user.following.map((user) => user.to_user);
  }

  async createFollows(fromUserId, toUserId) {
    const toUser = await prisma.user.findUnique({
      where: {
        user_id: toUserId,
      },
    });

    if (!toUser) {
      throw { status: 404, message: '유저를 찾을 수 없습니다.' };
    }

    const isFollowed = await prisma.follow.findFirst({
      where: {
        from_user_id: fromUserId,
        to_user_id: toUserId,
      },
    });
    if (isFollowed) return;

    await prisma.follow.create({
      data: {
        from_user_id: fromUserId,
        to_user_id: toUserId,
      },
    });
  }
}

export default UsersService;
