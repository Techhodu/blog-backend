import { Request, Response, NextFunction } from "express";
import { Post } from "../models/postModel";
import { PostType, myParams } from "../types/types";
import ErrorHandler from "../utils/utility-class";
import { TryCatch } from "../middlewares/error";
// import { translate } from "bing-translate-api";
import { translate } from "@vitalets/google-translate-api";
import { translate as bingtranslate } from "bing-translate-api";
import { detectLanguage } from "../helpers/lang";
import { IDBuilder, slugBuilder } from "../helpers";
import { Image } from "../models/imageModel";
// import { singleUpload } from "../middlewares/multer";

export const newPost = TryCatch(
  async (
    req: Request<any, {}, PostType>,
    res: Response,
    next: NextFunction
  ) => {
    const {
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
    } = req.body;

    if (!title || !content || !primaryCategory || !postType) {
      next(new ErrorHandler("Please add all fileds", 400));
    }

    var generatedSlug = undefined;
    if (slug) {
      generatedSlug = slugBuilder(slug);
    } else {
      const language = await detectLanguage(title);
      if (language) {
        try {
          var result = await bingtranslate(slug?.toString(), null, language);

          if (result?.translation) {
            generatedSlug = slugBuilder(result?.translation);
          }
        } catch (error) {
          console.error(error); // Log the error for debugging
          next(
            new ErrorHandler(
              "There was an issue with translating the slug. Please enter the slug in English or get in touch with the system administrator for assistance",
              500
            )
          );
        }
      }
    }
    const uid = await IDBuilder("mongoDB");
    if (!uid) {
      return res.status(500).json({
        success: false,
        message:
          "uid creation failed; please try again or contact system admin.",
      });
    }

    let post = await Post.create({
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
  }
);

export const getAllPost = TryCatch(async (req, res, next) => {
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
  const page: number = parseInt(req.query.page as string) || 1;
  const limit: number = parseInt(req.query.limit as string) || 10;

  interface queryInterface {
    title: { $regex: any; $options: string };
    primaryCategory?: any;
    categories?: any;
    version?: number;
    subcategories?: any;
    tags?: any;
    authors?: any;
    slug?: any;
    status?: any;
    createdBy?: any;
    createdAt?: any;
  }

  const query: queryInterface = {
    title: { $regex: search, $options: "i" },
  };
  if (!categories) {
    query.version = 1;    
  } else {
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
  const posts = await Post.find(query)
    .populate("image")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const count = await Post.countDocuments(query);
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

export const getPostDetails = TryCatch(async (req, res, next) => {
  const id: string = req.params.id;
  const post = await Post.findById(id).populate("createdBy").populate("image").populate("tags");
  if (!post) return next(new ErrorHandler("Invalid Post id", 400));

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
