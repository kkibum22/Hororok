import UserDto from '../../users/dto/user.dto';

class FeedDto {
  feed_id;
  contents;
  created_at;

  user;

  likes_cnt;
  comments_cnt;

  constructor(props) {
    this.feed_id = props.feed_id;
    this.contents = props.contents;
    this.created_at = props.created_at;
    this.user = new UserDto(props.user);

    this.likes_cnt = props._count?.feedlikes;
    this.comments_cnt = props._count?.comments;
  }
}

export default FeedDto;
