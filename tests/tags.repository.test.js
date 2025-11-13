import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/models/tag.js", () => ({
  default: {
    create: jest.fn(),
    findByPk: jest.fn(),
  },
}));

const Tag = await import("../src/models/tag.js");
const { default: TagRepository } = await import(
  "../src/repositories/tags.repository.js"
);
import { v4 as uuidv4 } from "uuid";

describe("TagRepository", () => {
  let tagRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    tagRepository = new TagRepository();
  });

  it("createTag should create a new tag", async () => {
    const tagData = {
      name: "New Tag",
    };
    const mockTag = { id: uuidv4(), ...tagData };
    Tag.default.create.mockResolvedValue(mockTag);

    const tag = await tagRepository.createTag(tagData);
    expect(Tag.default.create).toHaveBeenCalledWith(tagData);
    expect(tag).toEqual(mockTag);
  });

  it("getTagById should return a tag by ID", async () => {
    const tagId = uuidv4();
    const mockTag = {
      id: tagId,
      name: "Sample Tag",
    };
    Tag.default.findByPk.mockResolvedValue(mockTag);
    const tag = await tagRepository.getTagById(tagId);
    expect(Tag.default.findByPk).toHaveBeenCalledWith(tagId);
    expect(tag).toEqual(mockTag);
  });

  it("updateTag should update an existing tag", async () => {
    const tagId = uuidv4();
    const existingTag = {
      id: tagId,
      name: "Old Tag",
      update: jest.fn(),
    };

    Tag.default.findByPk.mockResolvedValue(existingTag);
    const updatedData = {
      name: "Updated Tag",
    };

    const tag = await tagRepository.updateTag(tagId, updatedData);
    expect(Tag.default.findByPk).toHaveBeenCalledWith(tagId);
    expect(existingTag.update).toHaveBeenCalledWith(updatedData);
    expect(tag).toEqual(existingTag);
  });

  it("deleteTag should delete an existing tag", async () => {
    const tagId = uuidv4();
    const existingTag = {
      id: tagId,
      name: "Tag to be deleted",
      destroy: jest.fn(),
    };
    Tag.default.findByPk.mockResolvedValue(existingTag);

    const tag = await tagRepository.deleteTag(tagId);
    expect(Tag.default.findByPk).toHaveBeenCalledWith(tagId);
    expect(existingTag.destroy).toHaveBeenCalled();
    expect(tag).toEqual(existingTag);
  });
});
