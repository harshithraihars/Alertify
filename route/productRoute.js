const express=require("express")
const { createProduct, getAllProducts, removeProduct } = require("../handler/productHandler")
const router=express.Router()
router.post("/api/products",createProduct)
router.get("/api/products",getAllProducts)
router.delete("/api/products",removeProduct)
module.exports=router

