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
async function validateTripGuideData(req, res) {
  const requiredFields = ['title', 'country', 'rating', 'content'];
  const data = req.body;
  for (const field of requiredFields) {
    if (!data[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }
  if (typeof data.title !== "string" || data.title.length > 30) {
    return res.status(400).json({ error: "Title must be a string with max length of 30 characters" });
  }
  if (typeof data.rating !== "number" || data.rating < 1 || data.rating > 5) {
    return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
  }
  if (typeof data.cost !== "number" || data.cost <= 0) {
    return res.status(400).json({ error: "Cost must be a positive number" });
  }
  if (typeof data.content !== "string" || data.content.length > 1000) {
    return res.status(400).json({ error: "Content must be a string with max length of 1000 characters" });
  }
  if (typeof data.duration !== "number" || data.duration <= 0) {
    return res.status(400).json({ error: "Days must be a positive number" });
  }
  return true;
}

// GET: get all guides
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

// GET: get a triguide by id
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

// GET: get my tripguides
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

// POST: post a guide, need auth
app.post("/tripguides", requireAuth, async (req, res) => {
  try {
    const isValid = await validateTripGuideData(req, res);
    if (isValid) {
      const auth0Id = req.auth.payload.sub;
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
      return res.json(tripGuide);
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// update one of my guide, need auth
app.put("/tripguides/:id", requireAuth, async (req, res) => {
  try {
    const isValid = await validateTripGuideData(req, res);
    if (isValid) {
      const { title, isPrivate, country, city, duration, rating, cost, content } = req.body;
      const auth0Id = req.auth.payload.sub;

      const id = req.params.id;
      const user = await prisma.user.findUnique({
        where: {
          auth0Id,
        },
      });
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
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
      return res.json(updateTripGuide);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// delete tripGuide with :id
app.delete("/tripguides/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const tripGuideId = parseInt(req.params.id);
  await prisma.comment.deleteMany({
    where: {
      tripGuideId: tripGuideId,
    },
  });

  const tripGuide = await prisma.tripGuide.delete({
    where: {
      id: tripGuideId,
    },
  });

  res.json(tripGuide);
});

// ====================================== guide comment endpoint ==========================================

async function validateCommentData(req, res) {
  const data = req.body;
  const content = data['content'];
  if (!content) {
    return res.status(400).json({ error: `content is required` });
  }
  if (typeof content !== "string" || content.length > 200) {
    return res.status(400).json({ error: "Content must be a string with max length of 200 characters" });
  }
  return true;
}

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
  try {
    const isValid = await validateCommentData(req, res);
    if (isValid) {
      const guideId = req.params.id;
      
      const guide = await prisma.tripGuide.findUnique({
        where: {
          id: parseInt(guideId),
        },
      });
      if (!guide) {
        return res.status(400).json({ error: "Guide not found" });
      }
      const auth0Id = req.auth.payload.sub;
      const user = await prisma.user.findUnique({
        where: {
          auth0Id,
        },
      });
      // check if this user exists
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
      const comment = await prisma.comment.create({
        data: {
          cuserId: user.id,
          tripGuideId: parseInt(guideId),
          content: req.body.content,
        },
        include: {
          cuser: true,
        },
      });
      return res.json(comment);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
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
  try {
    const auth0Id = req.auth.payload.sub;
    const { gender, birthDate, introduction } = req.body;
    if (typeof introduction !== "string" || introduction.length > 1000) {
      return res.status(400).json({ error: "Introduction must be a string with max length of 1000 characters" });
    }
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
    return res.json(updateUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
