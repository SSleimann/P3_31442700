import { Op } from "sequelize";

class QueryBuilder {
  constructor(model, query, relationConfig = []) {
    this.model = model;
    this.query = query || {};
    this.options = {
      where: {},
      include: [],
    };
    this.relationConfig = relationConfig || [];
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
      in: Op.in,
    };
    const filterFields = new Set(fields || []);
    const regexMatch =
      /^([a-zA-Z0-9]+)(?:__([a-zA-Z0-9]+))?(?:__(gt|gte|lt|lte|eq|ne|like|in))?$/;

    const relationMap = new Map();

    for (const key in this.query) {
      const value = this.query[key];
      const expressionMatch = regexMatch.exec(key);
      if (!expressionMatch) continue;

      const [, part1, part2, part3] = expressionMatch || [];

      if (
        !filterFields.has(`${part1}__${part2}`) &&
        !filterFields.has(`${part1}__${part2}__${part3}`)
      ) {
        continue;
      }

      const operatorKey = part3 || part2;
      const operator = operatorsMap[operatorKey];
      const relation = this.relationConfig.find((rel) => rel.as === part1);
      if (relation && part2) {
        if (!this.options.include) this.options.include = [];
        if (!relationMap.has(part1)) {
          relationMap.set(part1, { ...relation, where: {} });
        }

        const relObj = relationMap.get(part1);
        this.applyWhere(relObj.where, operator || Op.eq, part2, value);
      } else if (!relation && part1 && part2) {
        this.applyWhere(this.options.where, operator || Op.eq, part1, value);
      }
    }

    this.options.include.push(...relationMap.values());

    return this;
  }

  applyWhere(whereObject, operator, field, value) {
    if (!whereObject[field]) {
      whereObject[field] = {};
    }

    whereObject[field][operator] = value;
  }

  async exec() {
    return await this.model.findAll(this.options);
  }
}

export default QueryBuilder;
