import prisma from '../../db';

class FeedService {
  async createFeed(contents, userId) {
    const newFeed = await prisma.feed.create({
      data: {
        contents,
        user: {
          connect: {
            user_id: userId,
          },
        },
      },
    });
    return newFeed;
  }

  async getFeed(feedId) {
    const feed = await prisma.feed.findFirst({
      where: {
        feed_id: Number(feedId),
      },
      include: {
        user: true,
      },
    });
    return feed;
  }

  async getFeeds() {
    const feeds = await prisma.feed.findMany({
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: true,
      },
    });
    return feeds;
  }
  async patchFeed(feedId, contents, userId) {
    const upadtedFeed = await prisma.feed.update({
      where: {
        feed_id: parseInt(feedId),
      },
      data: {
        contents,
        user: { connect: { user_id: parseInt(userId) } },
      },
    });
    return;
  }

  async deleteFeed(feedId, userId) {
    const deletedFeed = await prisma.feed.delete({
      where: {
        feed_id: parseInt(feedId),
        user_id: parseInt(userId),
      },
    });
    return;
  }

  async likeFeed(feedId, userId) {
    const exist = await prisma.feedlike.findUnique({
      where: {
        user_id_feed_id: {
          user_id: parseInt(userId),
          feed_id: parseInt(feedId),
        },
      },
    });
    if (exist) return;

    await prisma.feedlike.create({
      data: {
        user: {
          connect: {
            user_id: parseInt(userId),
          },
        },
        feed: {
          connect: {
            feed_id: parseInt(feedId),
          },
        },
      },
    });
    return;
  }
  async unlikeFeed(feedId, userId) {
    const exist = await prisma.feedlike.findUnique({
      where: {
        user_id_feed_id: {
          user_id: parseInt(userId),
          feed_id: parseInt(feedId),
        },
      },
    });
    if (!exist) return;
    const newFeed = await prisma.feedlike.delete({
      where: {
        user_id_feed_id: {
          user_id: parseInt(userId),
          feed_id: parseInt(feedId),
        },
      },
    });
    return newFeed;
  }
}

export default FeedService;
