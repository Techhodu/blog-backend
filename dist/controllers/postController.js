"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostDetails = exports.getAllPost = exports.newPost = void 0;
const postModel_1 = require("../models/postModel");
const utility_class_1 = __importDefault(require("../utils/utility-class"));
const error_1 = require("../middlewares/error");
const bing_translate_api_1 = require("bing-translate-api");
const lang_1 = require("../helpers/lang");
const helpers_1 = require("../helpers");
// import { singleUpload } from "../middlewares/multer";
exports.newPost = (0, error_1.TryCatch)(async (req, res, next) => {
    const { title, summary, description, image, content, postType, primaryCategory, categories, slug, tags, authors, status, metaData, socialData, schemaData, version, } = req.body;
    if (!title || !content || !primaryCategory || !postType) {
        next(new utility_class_1.default("Please add all fileds", 400));
    }
    var generatedSlug = undefined;
    if (slug) {
        generatedSlug = (0, helpers_1.slugBuilder)(slug);
    }
    else {
        const language = await (0, lang_1.detectLanguage)(title);
        if (language) {
            try {
                var result = await (0, bing_translate_api_1.translate)(slug?.toString(), null, language);
                if (result?.translation) {
                    generatedSlug = (0, helpers_1.slugBuilder)(result?.translation);
                }
            }
            catch (error) {
                console.error(error); // Log the error for debugging
                next(new utility_class_1.default("There was an issue with translating the slug. Please enter the slug in English or get in touch with the system administrator for assistance", 500));
            }
        }
    }
    const uid = await (0, helpers_1.IDBuilder)("mongoDB");
    if (!uid) {
        return res.status(500).json({
            success: false,
            message: "uid creation failed; please try again or contact system admin.",
        });
    }
    let post = await postModel_1.Post.create({
        title,
        summary,
        description,
        image,
        content,
        postType,
        primaryCategory,
        categories,
        slug,
        tags,
        authors,
        status,
        metaData,
        socialData,
        schemaData,
        version,
        _id: uid,
        createdBy: "sanjeev-kumar",
    });
    return res.status(201).json({
        success: true,
        // message: ` ${post.type} has been created`,
    });
});
exports.getAllPost = (0, error_1.TryCatch)(async (req, res, next) => {
    const search = req.query.q || "";
    const primaryCategory = req.query.primaryCategory || "";
    const categories = req.query.category || "";
    const subcategories = req.query.subCategory || "";
    const slug = req.query.slug || "";
    const tags = req.query.tags || "";
    const authors = req.query.authors || "";
    const status = req.query.status || "";
    const createdBy = req.query.createdBy || "";
    const createdAt = req.query.createdAt || -1;
    const sort = req.query.sort || "";
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = {
        title: { $regex: search, $options: "i" },
    };
    if (!categories) {
        query.version = 1;
    }
    else {
        query.categories = categories;
    }
    if (primaryCategory) {
        query.primaryCategory = primaryCategory;
    }
    if (subcategories) {
        query.subcategories = subcategories;
    }
    if (slug) {
        query.slug = slug;
    }
    if (tags) {
        query.tags = tags;
    }
    if (authors) {
        query.authors = authors;
    }
    if (status) {
        query.status = status;
    }
    if (createdBy) {
        query.createdBy = createdBy;
    }
    if (startDate && endDate) {
        query.createdAt = { $gte: startDate, $lte: endDate };
    }
    const skip = (page - 1) * limit; // 1 * 4 = 4
    const posts = await postModel_1.Post.find(query)
        .populate("image")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
    const count = await postModel_1.Post.countDocuments(query);
    const pageCount = Math.ceil(count / limit);
    return res.status(200).json({
        success: true,
        Pagination: {
            count,
            pageCount,
        },
        posts,
    });
});
exports.getPostDetails = (0, error_1.TryCatch)(async (req, res, next) => {
    const id = req.params.id;
    const post = await postModel_1.Post.findById(id).populate("createdBy").populate("image").populate("tags");
    if (!post)
        return next(new utility_class_1.default("Invalid Post id", 400));
    return res.status(200).json({
        success: true,
        post,
    });
});
// // export const deletePost = TryCatch(async (req, res, next) => {
//   const id: string = req.params.id;
//   const user = await User.findById(id);
//   if (!user) return next(new ErrorHandler("Invalid User id", 400));
//   await user.deleteOne();
//   return res.status(200).json({
//     success: true,
//     message: "User Deleted Succesfully",
//   });
// });
