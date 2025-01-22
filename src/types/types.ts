import { NextFunction, Request, Response } from "express";

export interface newUserRequstBody {
  _id: string;
  name: string;
  description: string;
  email: string;
  photo: string;
  role: string;
  gender: string;
  dob: Date;
}

export interface myParams {
  id: string;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

type ThumbImage = {
  title: string;
  credits: string;
  Url: string;
  // Other fields...
};

interface Block {
  id: string;
  type: string;
  data: any;
}

interface Content {
  time: string;
  blocks: Block[];
  version: string;
}
interface metaData {
  metatitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  index: boolean;
}
interface socialData {
  ogtitle?: string;
  ogImage?: string;
  hashtags?: string[];
}
interface schemaData {
  articleTypeSchema: "None" | "Article" | "NewsArticle" | "BlogPosting";
  otherSchema?: {
    name: "None" | "FAQPage" | "JobPosting ";
    schemaData: any;
  };
}
export interface PostType {
  title: string;
  summary?: string | undefined;
  description?: string;
  image: string | undefined;
  content: any;
  postType: "Article" | "Slide" | "Webstory" | "EPaper";
  primaryCategory: string;
  categories: string[];
  // subcategories: string[];
  slug: string;
  tags: string[];
  authors?: string[];
  status: "Draft" | "Published" | "Archived";
  publicAt?: Date;
  metaData?: metaData;
  socialData?: socialData;
  schemaData?: schemaData;
  version?: number;
}
export type CategoryType = {
  title: string;
  slug: string;
  visibility?: "hamburgerMenu" | "mainMenu" | "both" | null;
  menuHierarchy?: number;
  homeHierarchy?: number;
  description?: string;
  categoryType: "section";
  keywords?: string[];
  createdBy: string;
  updatedBy?: string[];
  status?: "active" | "inactive";
};

export type SubCategoryType = {
  title: string;
  slug: string;
  visibility?: "hamburgerMenu" | "mainMenu" | "both" | null;
  menuHierarchy?: number;
  homeHierarchy?: number;
  description?: string;
  categoryType: "subSection";
  keywords?: string[];
  createdBy: string;
  updatedBy?: string[];
  status?: "active" | "inactive";
  category: String;
};

export interface newUniqueIdRequestBody {
  _id?: string;
  idFor: string;
  count?: string;
}
export interface ImageType {
  // _id: string;
  title: string;
  credits?: string;
  // url: string;
  updatedby?: string;
}

export type TagType = {
  _id?: string;
  name: string;
};

// export type SubCategoryType = CategoryType & SubCategoryTypeAdditional;

interface Block {
  id: string;
  type: string;
  data: any;
}

interface Content {
  time: string;
  blocks: Block[];
  version: string;
}

interface metaData {
  metatitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  index: boolean;
}

export interface StaticPageType {
  title: string;
  content: Content;
  slug: string;
  status: "Public" | "Private";
  metaData?: metaData;
}
