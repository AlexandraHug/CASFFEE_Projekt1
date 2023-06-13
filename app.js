import express from 'express';
import bodyParser from 'body-parser';
import path, {dirname} from 'path';
import {fileURLToPath} from "url";
import {todoRoutes} from './routes/todo-routes.js';


const metaDirname = dirname(fileURLToPath(import.meta.url));

// eslint-disable-next-line import/prefer-default-export
export const app = express();

app.use(express.static(path.resolve('source/public')));
app.use(express.static(path.resolve('public')));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile("/index.html", {root: `${metaDirname  }/source/public/`});
});

app.use("/todos", todoRoutes);
