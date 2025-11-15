import { Op, fn, col, where } from "sequelize";

class QueryBuilder {
  constructor(model, query) {
    this.model = model;
    this.query = query || {};
    this.options = {
      where: {},
    };
  }

  paginate(maxLimit = 20) {
    const page = Math.max(1, Number.parseInt(this.query.page, 10) || 1);
    const limit = Math.min(
      maxLimit,
      Number.parseInt(this.query.limit, 10) || 10
    );

    const offset = (page - 1) * limit;
    this.options.limit = limit;
    this.options.offset = offset;
    return this;
  }

  textSearch() {
    if (this.query.q) {
      const searchTerm = this.query.q;
      this.options.where[Op.or] = [
        where(fn("LOWER", col("name")), {
          [Op.like]: `%${searchTerm.toLowerCase()}%`,
        }),
        where(fn("LOWER", col("description")), {
          [Op.like]: `%${searchTerm.toLowerCase()}%`,
        }),
      ];
    }
    return this;
  }

  sort() {
    if (this.query.sortBy) {
      const sortField = this.query.sortBy;
      const sortOrder =
        this.query.order && this.query.order.toLowerCase() === "desc"
          ? "DESC"
          : "ASC";
      this.options.order = [[sortField, sortOrder]];
    }
    return this;
  }

  filter(fields) {
    const operatorsMap = {
      gt: Op.gt,
      gte: Op.gte,
      lt: Op.lt,
      lte: Op.lte,
      eq: Op.eq,
      ne: Op.ne,
      like: Op.like,
    };
    const filterFields = new Set(fields || []);

    for (const key in this.query) {
      if (!filterFields.has(key)) continue;
      const value = this.query[key];
      const operatorRegex = /(.*)__(gt|gte|lt|lte|eq|ne|like)$/;
      const operatorMatch = operatorRegex.exec(key);

      if (operatorMatch) {
        const field = operatorMatch[1];
        const operator = operatorsMap[operatorMatch[2]];

        if (!this.options.where[field]) {
          this.options.where[field] = {};
        }

        this.options.where[field][operator] =
          operator === Op.like ? `%${value}%` : value;
      } else {
        this.options.where[key] = value;
      }
    }
    console.log(this.options.where, "asmdkajdpojwqodjwqojwd");
    return this;
  }

  async exec() {
    return await this.model.findAll(this.options);
  }
}

export default QueryBuilder;
