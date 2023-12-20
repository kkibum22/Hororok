import cors from "cors";
import express from "express";
import helmet from "helmet";
import prisma from "./db";
import Controllers from "./modules";
import cookieParser from "cookie-parser";
import session from "express-session";

(async () => {
  const app = express();
  // db connection
  await prisma.$connect();

  // middleware
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
    })
  );

  // route
  Controllers.forEach((controller) => {
    app.use(controller.path, controller.router);
  });

  // error handling
  app.use((err, req, res, next) => {
    res
      .status(err.status || 500)
      .json({ message: err.message || "서버에서 에러가 발생하였습니다." });
  });

  app.listen(8000, () => {
    console.log("서버가 시작되었습니다.");
  });
})();
