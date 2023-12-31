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
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
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
        gender: editUserDto.gender,
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
        user_id: user.user_id,
      },
    });
  }

  async findFollowersById(userId) {
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        followers: {
          include: {
            from_user: true,
          },
        },
      },
    });
    if (!user) {
      throw { status: 404, message: '해당 유저가 존재하지 않습니다.' };
    }

    return user.followers.map((user) => user.from_user);
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

  async findLikedFeedsByUserId(userId) {
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

    const likedFeeds = await prisma.feedlike.findMany({
      where: {
        user_id: user.user_id,
      },
    });

    return likedFeeds.map((n) => n.feed_id);
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

  async deleteFollows(fromUserId, toUserId) {
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
    if (!isFollowed) return;

    await prisma.follow.delete({
      where: {
        follow_id: isFollowed.follow_id,
      },
    });
  }
}

export default UsersService;
