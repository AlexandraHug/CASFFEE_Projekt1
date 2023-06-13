import express from 'express';

import {todosController} from '../controller/todos-controller.js';

const router = express.Router();


router.get("/sortFilter", todosController.getTodos);
router.post("/", todosController.createTodo);
router.get("/:id/", todosController.showTodo);
router.post("/:id/", todosController.changeTodo);

// eslint-disable-next-line import/prefer-default-export
export const todoRoutes = router;