class UsersDto {
  userId;
  id;
  name;
  nickname;
  birth;
  gender;

  constructor(props) {
    this.userId = props.user_id;
    this.id = props.id;
    this.name = props.name;
    this.nickname = props.nickname;
    this.birth = props.birth;
    this.gender = props.gender;
  }
}

export default UsersDto;
