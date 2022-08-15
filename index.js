// my-server.js
import { handler } from "./client/build/handler.js";
import { startGameServer } from "./server/build/index.js";
import { createServer } from "http";
import express from "express";
const port = process.env.PORT || 42824;

const app = express();
// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

const server = createServer(app);

startGameServer(server);

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
