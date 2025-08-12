"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import dotenv from "dotenv";
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_mongoose_1 = require("./infra/db/db.mongoose");
const session_routes_1 = __importDefault(require("./session/session.routes"));
const user_routes_1 = __importDefault(require("./user/user.routes"));
const token_routes_1 = __importDefault(require("./token/token.routes"));
const token_middleware_1 = __importDefault(require("./middlewares/token.middleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
// dotenv.config({ path: [".env.development", ".env.production"] });
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_mongoose_1.connectToDatabase)();
    app.get("/", (req, res) => {
        return res.json({ message: "It is on air." });
    });
    app.use("/", session_routes_1.default);
    app.use("/", token_routes_1.default);
    app.use("/users", token_middleware_1.default, user_routes_1.default);
    const PORT = process.env.API_PORT || 8080;
    app.listen(PORT);
}))();
