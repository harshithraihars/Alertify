const productModel = require("../Schema/productSchema")

const createProduct=async (req,res)=>{
    try{
        const {product_url,product_name,price_limit}=req.body
        console.log(price_limit,product_url,product_name);
        
    const newProduct=new productModel({product_url,product_name,price_limit})
    await newProduct.save()
    res.status(201).send({message:"Product Added to the que succefully"})
    }catch(err){
        res.status(400).json({error:err.message})
    }
}
const getAllProducts = async (req, res) => {
    try {
      const products = await productModel.find();
      res.status(200).json({ products });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
const removeProduct = async (req, res) => {
    try {
      const { product_name } = req.body;
      const deletedProduct = await productModel.findOneAndDelete({ product_name:product_name });
      
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({ message: "Product removed successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
module.exports={createProduct,getAllProducts,removeProduct}