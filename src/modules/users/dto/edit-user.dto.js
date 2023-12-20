import bcrypt from 'bcrypt';

export class EditUserDTO {
  name;
  nickname;
  birth;
  gender;
  pw;

  constructor(user) {
    this.name = user.name ?? undefined;
    this.nickname = user.nickname ?? undefined;
    this.birth = user.birth ?? undefined;
    this.gender = user.gender ?? undefined;
    this.pw = user.pw ?? undefined;
  }

  async updatePassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

export default EditUserDTO;
