// pages/api/categories.js
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

mongooseConnect(); 

export default async function handler(req, res) {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
