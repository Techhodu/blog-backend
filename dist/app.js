"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cloudinary_1 = require("cloudinary");
const features_1 = require("./utils/features");
const error_1 = require("./middlewares/error");
const user_Routes_1 = __importDefault(require("./routes/user.Routes"));
const post_Routes_1 = __importDefault(require("./routes/post.Routes"));
const category_Routes_1 = __importDefault(require("./routes/category.Routes"));
const subCategory_Routes_1 = __importDefault(require("./routes/subCategory.Routes"));
const uniqueId_Routes_1 = __importDefault(require("./routes/uniqueId.Routes"));
const image_Routes_1 = __importDefault(require("./routes/image.Routes"));
const translater_Routes_1 = __importDefault(require("./routes/translater.Routes"));
const tag_Routes_1 = __importDefault(require("./routes/tag.Routes"));
const StaticPage_Routes_1 = __importDefault(require("./routes/StaticPage.Routes"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
// import { config } from "../";
(0, dotenv_1.config)({ path: "./.env" });
const port = process.env.PORT || 4000;
(0, features_1.connectDb)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/users", user_Routes_1.default);
app.use("/api/v1/posts", post_Routes_1.default);
app.use("/api/v1/categories", category_Routes_1.default);
app.use("/api/v1/subCategories", subCategory_Routes_1.default);
app.use("/api/v1/uniqueids", uniqueId_Routes_1.default);
app.use("/api/v1/tags", tag_Routes_1.default);
app.use("/api/v1/staticPages", StaticPage_Routes_1.default);
app.use("/api/v1/files/", image_Routes_1.default);
app.use("/api/v1/translater", translater_Routes_1.default);
app.use("/uploads", express_1.default.static("uploads"));
app.get("/", (req, res) => {
    res.send('api working on => "/api/v1👌👌..."');
});
app.use(error_1.errorMiddleware);
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.listen(port, () => {
    console.log(`server is working on 👌 ${port}...`);
});
