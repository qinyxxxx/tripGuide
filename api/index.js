import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg, { Prisma } from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

// add your endpoints below this line

app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});

// ====================================== trip guide endpoint ==========================================
// get all guides
app.get("/tripguides", async (req, res) => {
  const tripguides = await prisma.tripGuide.findMany({
    where: {
      isPrivate: false,
    },
    include: {
      comment: {
        include: {
          cuser: true, // Include the user related to each comment
        },
      },
      guser: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json(tripguides);
});

// get a triguide by id
app.get("/tripguides/:id", async (req, res) => {
  const tripGuide = await prisma.tripGuide.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      comment: {
        include: {
          cuser: true, // Include the user related to each comment
        },
      },
      guser: true
    },
  });
  res.json(tripGuide);
});

// get my tripguides
app.get("/my-tripguides", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const tripGuide = await prisma.tripGuide.findMany({
    where: {
      guserId: user.id,
    },
    include: {
      comment: {
        include: {
          cuser: true,
        },
      },
      guser: true
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  res.json(tripGuide);
});

// post a guide, need auth
app.post("/tripguides", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  // todo validate data

  const { title, isPrivate, country, city, duration, rating, cost, content } = req.body;

  const tripGuide = await prisma.tripGuide.create({
    data: {
      guser: { connect: { auth0Id } },
      title,
      isPrivate,
      country,
      city,
      duration,
      rating,
      cost,
      content,
    }
  });

  res.json(tripGuide);
});

// update one of my guide, need auth
app.put("/tripguides/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  // todo validate data
  // need to check if this post is mine

  const id = req.params.id;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const { title, isPrivate, country, city, duration, rating, cost, content } = req.body;

  const updateTripGuide = await prisma.tripGuide.update({
    where: {
      id: parseInt(id),
      guserId: user.id,
    },
    data: {
      title,
      isPrivate,
      country,
      city,
      duration,
      rating,
      cost,
      content,
    }
  });

  res.json(updateTripGuide);
});

// delete tripGuide with :id
app.delete("/tripguides/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  const id = req.params.id;
  const triguide = await prisma.tripGuide.delete({
    where: {
      id: parseInt(id),
      guserId: user.id,
    }
  });
  res.json(triguide);
});

// ====================================== guide commtent endpoint ==========================================

// get comments by trip guide id
app.get("/tripguides/:id/comments", async (req, res) => {
  const guideId = req.params.id;
  const comments = await prisma.comment.findMany({
    where: {
      tripGuideId: parseInt(guideId),
    },
    include: {
      cuser: true,
    }
  });
  res.json(comments);
});

// post a comment, need auth
app.post("/tripguides/:id/comments", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const guideId = req.params.id;
  // todo validate data

  const { content } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const comment = await prisma.comment.create({
    data: {
      cuserId: user.id,
      tripGuideId: parseInt(guideId),
      content,
    },
    include: {
      cuser: true,
    },
  });

  res.json(comment);
});

// delete a comment, need auth
app.delete("/tripguides/:tripGuideId/comments/:commentId", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const guideId = req.params.tripGuideId;
  const commentId = req.params.commentId;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const deletedComment = await prisma.comment.delete({
    where: {
      id: parseInt(commentId),
      tripGuideId: parseInt(guideId),
      cuserId: user.id,
    },
  });
  res.json(deletedComment);
});

// ====================================== user endpoint ==========================================

app.get("/user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  res.json(user);
});

app.put("/user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const { gender, birthDate, introduction } = req.body;
  const updateUser = await prisma.user.update({
    where: {
      auth0Id: auth0Id
    },
    data: {
      gender,
      birthDate,
      introduction,
    }
  });

  res.json(updateUser);
});


app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
