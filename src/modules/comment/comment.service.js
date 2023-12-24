import prisma from '../../db';

class CommentService {
  async createComment(feedId, contents, userId) {
    const newComment = await prisma.comment.create({
      data: {
        contents,
        feed: { connect: { feed_id: parseInt(feedId) } },
        user: { connect: { user_id: parseInt(userId) } },
      },
    });
    return newComment;
  }

  async getComment(feedId) {
    const comments = await prisma.comment.findMany({
      where: {
        feed_id: parseInt(feedId),
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: true,
      },
    });
    return comments;
  }

  async patchComment(commentId, contents, user) {
    const upadtedComment = await prisma.comment.update({
      where: {
        comment_id: parseInt(commentId),
      },
      data: {
        contents,
        user: { connect: { user_id: parseInt(user.user_id) } },
      },
    });
    return;
  }

  async deleteComment(commentId, user) {
    const deletedComment = await prisma.comment.delete({
      where: {
        comment_id: parseInt(commentId),
        user_id: parseInt(user.user_id),
      },
    });
    return;
  }
}

export default CommentService;
