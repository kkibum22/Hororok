import prisma from '../../db';

class AuthService {
  async createUser(pw, name, nickname, birth, gender) {
    const existUser = await prisma.user.findFirst({
      where: {
        name: name,
      },
    });

    if (existUser) {
      throw { status: 400, message: '이미 사용중인 아이디입니다.' };
    }

    const user = await prisma.user.create({
      data: { pw, name, nickname, birth, gender },
    });

    return user;
  }
}

export default AuthService;
