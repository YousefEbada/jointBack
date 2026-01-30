import { Router } from "express";
import { uploadVideo } from "shared/middleware/multer.js";
import { createExercise, getExerciseVideo, getAllExercises, deleteExercise } from "./controllers/exercise.controller.js";

const exerciseRoutes = Router();

exerciseRoutes.post("/", uploadVideo.single("video"), createExercise);
exerciseRoutes.get( "/:id/video", getExerciseVideo);
exerciseRoutes.get('/', getAllExercises);
exerciseRoutes.delete("/:id", deleteExercise);

export default exerciseRoutes;
