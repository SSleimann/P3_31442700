import CategoryRepository from "../repositories/category.repository.js";

const repo = new CategoryRepository();

const getAllCategories = async (req, res) => {
  try {
    const categories = await repo.filterCategories({});

    return res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch categories",
    });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await repo.getCategoryById(id);
    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch category by ID",
    });
  }
};

const createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({
      status: "error",
      message: "Name and description are required",
    });
  }

  try {
    const newCategory = await repo.createCategory({
      name,
      description,
    });
    return res.status(201).json({
      status: "success",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create category",
    });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({
      status: "error",
      message: "Name and description are required",
    });
  }

  try {
    const updatedCategory = await repo.updateCategory(id, {
      name,
      description,
    });

    if (!updatedCategory) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update category",
    });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await repo.deleteCategory(id);

    if (!deletedCategory) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete category",
    });
  }
};

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
