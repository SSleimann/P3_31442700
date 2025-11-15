import Product from "../models/product.js";

import QueryBuilder from "../utils/query.js";

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

  async filterProducts(criteria = {}, options = {}) {
    const {
      paginate = true,
      maxLimit = 20,
      sort = true,
      filterFields = [],
    } = options;

    const queryBuilder = new QueryBuilder(Product, criteria);

    if (paginate) queryBuilder.paginate(maxLimit);
    if (sort) queryBuilder.sort();

    queryBuilder.textSearch();
    queryBuilder.filter(filterFields);

    return await queryBuilder.exec();
  }
}

export default ProductRepository;
