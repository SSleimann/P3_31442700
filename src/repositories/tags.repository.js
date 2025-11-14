import Tag from "../models/tag.js";

class TagRepository {
  async createTag(data) {
    const tag = await Tag.create(data);
    return tag;
  }

  async getTagById(id) {
    const tag = await Tag.findByPk(id);
    return tag;
  }

  async updateTag(id, data) {
    const tag = await this.getTagById(id);
    if (tag) {
      await tag.update(data);
    }
    return tag;
  }

  async deleteTag(id) {
    const tag = await this.getTagById(id);
    if (tag) {
      await tag.destroy();
    }
    return tag;
  }

  async filterTags(criteria) {
    const tags = await Tag.findAll({ where: criteria });
    return tags;
  }
}

export default TagRepository;
