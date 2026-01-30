import { BLOB_PORT, EXERCISE_REPO } from "app/container.bindings.js";
import { resolve } from "app/container.js";
import { Request, Response } from "express";

import { azureBlobAdapter } from "infra/storage/blob.azure.adapter.js";
import { CreateExercise } from "modules/exercise/application/use-cases/CreateExercise.js";
import { DeleteExercise } from "modules/exercise/application/use-cases/DeleteExercise.js";
import { GetAllExercises } from "modules/exercise/application/use-cases/GetAllExercises.js";
import { GetExerciseVideo } from "modules/exercise/application/use-cases/GetExercise.js";

export const createExercise = async (req: Request, res: Response) => {
  try {
    const uc = new CreateExercise(resolve(BLOB_PORT), resolve(EXERCISE_REPO));

    const result = await uc.exec({
      title: req.body.title,
      description: req.body.description,
      file: req.file!
    });

    if (!result.ok) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);

  } catch (error) {
    console.error("============ createExercise Controller Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getExerciseVideo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const uc = new GetExerciseVideo(resolve(BLOB_PORT), resolve(EXERCISE_REPO));
    const result = await uc.exec(id);
    if (!result.ok) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error("============ getExerciseVideo Controller Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllExercises = async (req: Request, res: Response) => {
  try {
    const uc = new GetAllExercises(resolve(EXERCISE_REPO));
    const result = await uc.exec();
    if (!result.ok) {
      return res.status(404).json(result);
    }
    console.log("============ All Exercises: ", result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("============ getAllExercises Controller Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteExercise = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const uc = new DeleteExercise(resolve(BLOB_PORT), resolve(EXERCISE_REPO));
    const result = await uc.exec(id);
    if (!result.ok) {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("============ deleteExercise Controller Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};