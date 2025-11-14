import Product from "../models/product.js";

class ProductRepository {
  async createProduct(data) {
    const product = await Product.create(data);
    return product;
  }

  async getProductById(id) {
    const product = await Product.findByPk(id);
    return product;
  }

  async updateProduct(id, data) {
    const product = await this.getProductById(id);

    if (product) {
      await product.update(data);
    }
    return product;
  }

  async deleteProduct(id) {
    const product = await this.getProductById(id);

    if (product) {
      await product.destroy();
    }
    return product;
  }

  async filterProducts(criteria) {
    const products = await Product.findAll({ where: criteria });
    return products;
  }
}

export default ProductRepository;
