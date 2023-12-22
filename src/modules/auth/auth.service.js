import prisma from '../../db';
import * as bcrypt from 'bcrypt';

class AuthService {
  async createUser(id, pw, name, nickname, birth, gender) {
    const existUser = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (existUser) {
      throw { status: 400, message: '이미 사용중인 아이디입니다.' };
    }
    const hashedPassword = await bcrypt.hash(pw, 10);
    const user = await prisma.user.create({
      data: {
        id,
        pw: hashedPassword,
        name,
        nickname,
        birth: new Date(birth),
        gender,
      },
    });

    return user;
  }

  async login(id, pw) {
    const existUser = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    if (!existUser) {
      throw { status: 400, message: '가입되지 않은 계정입니다.' };
    }
    const check = await bcrypt.compare(pw, existUser.pw);

    if (!check) {
      throw { status: 400, message: '패스워드가 일치하지 않습니다.' };
    }

    const { pw: _, ...user } = existUser;

    return user;
  }
}

export default AuthService;
