import express from "express";
import { createCategoryController } from "../controllers/category.controller.js";

export const apiRouter = express.Router();

apiRouter.post("/api/categories", createCategoryController);
