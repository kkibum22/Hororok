class UserDto {
  user_id;
  id;
  name;
  nickname;
  birth;
  gender;

  constructor(props) {
    this.user_id = props.user_id;
    this.id = props.id;
    this.name = props.name;
    this.nickname = props.nickname;
    this.birth = props.birth;
    this.gender = props.gender;

    this.followers_cnt = props._count?.followers;
    this.following_cnt = props._count?.following;
  }
}

export default UserDto;
