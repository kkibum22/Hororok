import prisma from "../../db";

class FeedService {
  async findFeed() {
    const feed = [{ id: 1, name: "name" }];
    return feed;
  }
}

export default FeedService;
