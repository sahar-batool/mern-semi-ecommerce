const Product = require('../Models/Product');

const getProducts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: 'i' };
  }

  let sortOption = { createdAt: -1 };

  if (req.query.sort === 'price_asc') {
    sortOption = { price: 1 };
  } else if (req.query.sort === 'price_desc') {
    sortOption = { price: -1 };
  } else if (req.query.sort === 'oldest') {
    sortOption = { createdAt: 1 };
  }

  const products = await Product.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    products,
  });
};

//product details
const getProductById = async(req, res)=> {
    const product = await Product.findById(req.params.id)

  if(!product) {
    res.status(401);
    throw new Error('product not found');
  }

  res.status(200).json({
    success: true,
    product,
  });
};


//product creation
const createProduct = async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    category,
    image,
    stock,
  });

  res.status(201).json({
    success: true,
    product,
  });
};


//product updation
  const updateProduct = async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  const product =await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({
    success: true,
    product,
  });
};


//delete product
 const deleteProduct = async (req, res) => {

  const product =await Product.findByIdAndDelete(req.params.id)

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({
    success: true,
    message:"product delete successfully"
  });
};





module.exports = { getProducts, getProductById , createProduct, updateProduct, deleteProduct};