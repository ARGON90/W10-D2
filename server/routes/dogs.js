// ------------------------------  SERVER DATA ------------------------------
const express = require("express");
const app = express();
app.use(express.json());
require("express-async-errors");

let dogsRouter = express.Router();

// app.use("/dogs", express.static("routes"))

let nextDogId = 1;
function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const dogs = [
  {
    dogId: getNewDogId(),
    name: "Fluffy",
  },
  {
    dogId: getNewDogId(),
    name: "Digby",
  },
];

// ------------------------------  MIDDLEWARES ------------------------------

const validateDogInfo = (req, res, next) => {
  if (!req.body || !req.body.name) {
    const err = new Error("Dog must have a name");
    err.statusCode = 400;
    next(err);
  }
  next();
};
const validateDogId = (req, res, next) => {
  const { dogId } = req.params;
  const dog = dogs.find((dog) => dog.dogId == dogId);
  if (!dog) {
    const err = new Error("Couldn't find dog with that dogId");
    err.statusCode = 404;
    throw err;
    // return next(err); // alternative to throwing it
  }
  next();
};

// ------------------------------  ROUTE HANDLERS ------------------------------

// GET /dogs
const getAllDogs = (req, res) => {
  res.json(dogs);
};

// GET /dogs/:dogId
const getDogById = (req, res) => {
  const { dogId } = req.params;
  const dog = dogs.find((dog) => dog.dogId == dogId);
  res.json(dog);
};

// POST /dogs
const createDog = (req, res) => {
  const { name } = req.body;
  const newDog = {
    dogId: getNewDogId(),
    name,
  };
  dogs.push(newDog);
  res.json(newDog);
};

// PUT /dogs/:dogId
const updateDog = (req, res) => {
  const { name } = req.body;
  const { dogId } = req.params;
  const dog = dogs.find((dog) => dog.dogId == dogId);
  dog.name = name;
  res.json(dog);
};

// DELETE /dogs/:dogId
const deleteDog = (req, res) => {
  const { dogId } = req.params;
  const dogIdx = dogs.findIndex((dog) => dog.dogId == dogId);
  dogs.splice(dogIdx, 1);
  res.json({ message: "success" });
};

// ------------------------------  ROUTER ------------------------------

dogsRouter.get("/", getAllDogs);

dogsRouter.get("/:dogId", validateDogId, getDogById); //Wgat the heck was next doing???

dogsRouter.post("/", validateDogInfo, createDog);
// dogsRouter.post("/", (req, res, next) => {
//     console.log("lol")
//   validateDogInfo(req, res, next);
//   createDog(req, res);
// });

dogsRouter.put("/:dogId", validateDogId, validateDogInfo, updateDog);

// dogsRouter.put("/:dogId", (req, res) => {
//   validateDogId(req, res);
//   validateDogInfo(req, res);
//   updateDog(req, res);
// });

dogsRouter.delete("/:dogId", validateDogId, deleteDog);

dogsRouter.use("/:dogId/foods", validateDogId, foodRouter)

module.exports = dogsRouter;
