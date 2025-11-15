import Product from "../models/product.js";
import Tag from "../models/tag.js";
import QueryBuilder from "../utils/query.js";

class ProductRepository {
  async createProduct(data) {
    const tags = Array.isArray(data.tags) ? data.tags : [];
    const createData = { ...data };
    delete createData.tags;

    const product = await Product.create(createData);

    if (tags.length) {
      await product.setProductTags(tags);
      await product.reload({
        include: [
          {
            model: Tag,
            as: "productTags",
            through: { attributes: [] },
          },
        ],
      });
    }

    return product;
  }

  async getProductById(id) {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Tag,
          as: "productTags",
          through: { attributes: [] },
        },
      ],
    });
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

    const relationConfig = [
      {
        model: Tag,
        as: "productTags",
        required: true,
        through: { attributes: [] },
      },
    ];

    const queryBuilder = new QueryBuilder(Product, criteria, relationConfig);

    if (paginate) queryBuilder.paginate(maxLimit);
    if (sort) queryBuilder.sort();

    queryBuilder.filter(filterFields);

    return await queryBuilder.exec();
  }
}

export default ProductRepository;
