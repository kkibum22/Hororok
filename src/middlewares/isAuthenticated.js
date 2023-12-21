export const isAuthenticated = (req, res, next) => {
  try {
    if (req.session.user) next();
    else throw { status: 401, message: '로그인이 필요합니다.' };
  } catch (e) {
    next(e);
  }
};
