import Category from "../models/category.js";

class CategoryRepository {
  async createCategory(data) {
    const category = await Category.create(data);
    return category;
  }

  async getCategoryById(id) {
    const category = await Category.findByPk(id);
    return category;
  }

  async updateCategory(id, data) {
    const category = await this.getCategoryById(id);
    if (category) {
      await category.update(data);
    }
    return category;
  }

  async deleteCategory(id) {
    const category = await this.getCategoryById(id);
    if (category) {
      await category.destroy();
    }
    return category;
  }
}

export default CategoryRepository;
