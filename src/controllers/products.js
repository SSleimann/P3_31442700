import ProductRepository from "../repositories/product.repository.js";
import CategoryRepository from "../repositories/category.repository.js";
import TagRepository from "../repositories/tags.repository.js";

const productRepository = new ProductRepository();
const categoryRepository = new CategoryRepository();
const tagRepository = new TagRepository();

export const createProduct = async (req, res) => {
  const { name, description, price, stock, categoryId, tags } = req.body;
  const priceNumber = Number.parseFloat(price);
  const tagsArray = Array.isArray(tags) ? tags : [];

  if (!name || Number.isNaN(priceNumber) || !categoryId) {
    return res.status(400).json({
      status: "error",
      message: "Name, price, and categoryId are required",
    });
  }

  try {
    for (const tagId of tagsArray) {
      const tag = await tagRepository.getTagById(tagId);
      if (!tag) {
        return res
          .status(400)
          .json({ status: "error", message: `Invalid tagId: ${tagId}` });
      }
    }

    const category = await categoryRepository.getCategoryById(categoryId);
    if (!category) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid categoryId" });
    }

    const product = await productRepository.createProduct({
      name,
      description,
      price,
      stock,
      categoryId,
      tags: tagsArray,
    });
    res.status(201).json({ status: "success", data: product });
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to create product" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productRepository.getProductById(id);

    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }

    res.json({ status: "success", data: product });
  } catch (error) {
    console.error("Error retrieving product:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to retrieve product" });
  }
};

export const filterProducts = async (req, res) => {
  const validFields = [
    "name__eq",
    "name__like",
    "description__eq",
    "description__like",
    "price__eq",
    "price__gt",
    "price__lt",
    "stock__eq",
    "stock__gt",
    "stock__lt",
    "categoryId",
    "productTags__name__eq",
    "productTags__id__in",
  ];

  const sanitizedQuery = {};
  for (const key in req.query) {
    if (validFields.includes(key)) {
      sanitizedQuery[key] = req.query[key];
    }
  }

  if (sanitizedQuery.productTags__id__in) {
    sanitizedQuery.productTags__id__in = Array.isArray(
      sanitizedQuery.productTags__id__in
    )
      ? sanitizedQuery.productTags__id__in
      : sanitizedQuery.productTags__id__in.split(",");
  }

  try {
    const products = await productRepository.filterProducts(sanitizedQuery, {
      filterFields: validFields,
    });
    res.json({ status: "success", data: products });
  } catch (error) {
    console.error("Error filtering products:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to filter products" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productRepository.deleteProduct(id);

    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }
    res.json({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to delete product" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, categoryId, tags } = req.body;
  const tagsArray = Array.isArray(tags) ? tags : [];

  try {
    for (const tagId of tagsArray) {
      const tag = await tagRepository.getTagById(tagId);
      if (!tag) {
        return res
          .status(400)
          .json({ status: "error", message: `Invalid tagId: ${tagId}` });
      }
    }

    const category = await categoryRepository.getCategoryById(categoryId);
    if (!category) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid categoryId" });
    }

    const product = await productRepository.updateProduct(id, {
      name,
      description,
      price,
      stock,
      categoryId,
    });

    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }

    res.json({ status: "success", data: product });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to update product" });
  }
};

export const autoHealingGetProduct = async (req, res) => {
  const { id } = req.params; // slug-id

  const regexExtractId = /-([a-f0-9-]{36})$/;
  const match = regexExtractId.exec(id);

  if (!match) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid product identifier" });
  }

  const extractedId = match[1];

  try {
    const product = await productRepository.getProductById(extractedId);

    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }

    if (product.slug !== id) {
      return res.redirect(301, `/products/auto-healing/${product.slug}`);
    }

    res.json({ status: "success", data: product });
  } catch (error) {
    console.error("Error retrieving product:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to retrieve product" });
  }
};
