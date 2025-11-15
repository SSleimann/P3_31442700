import { vi, describe, it, beforeEach, expect } from "vitest";
import Tag from "../src/models/tag.js";
import TagRepository from "../src/repositories/tags.repository.js";
import { v4 as uuidv4 } from "uuid";

vi.mock("../src/models/tag.js", () => ({
  default: {
    create: vi.fn(),
    findByPk: vi.fn(),
  },
}));

describe("TagRepository", () => {
  let tagRepository;

  beforeEach(() => {
    vi.mocked(Tag.create).mockReset();
    vi.mocked(Tag.findByPk).mockReset();
    tagRepository = new TagRepository();
  });

  it("createTag should create a new tag", async () => {
    const tagData = {
      name: "New Tag",
    };
    const mockTag = { id: uuidv4(), ...tagData };
    Tag.create.mockResolvedValue(mockTag);

    const tag = await tagRepository.createTag(tagData);
    expect(Tag.create).toHaveBeenCalledWith(tagData);
    expect(tag).toEqual(mockTag);
  });

  it("getTagById should return a tag by ID", async () => {
    const tagId = uuidv4();
    const mockTag = {
      id: tagId,
      name: "Sample Tag",
    };
    Tag.findByPk.mockResolvedValue(mockTag);
    const tag = await tagRepository.getTagById(tagId);
    expect(Tag.findByPk).toHaveBeenCalledWith(tagId);
    expect(tag).toEqual(mockTag);
  });

  it("updateTag should update an existing tag", async () => {
    const tagId = uuidv4();
    const existingTag = {
      id: tagId,
      name: "Old Tag",
      update: vi.fn(),
    };

    Tag.findByPk.mockResolvedValue(existingTag);
    const updatedData = {
      name: "Updated Tag",
    };

    const tag = await tagRepository.updateTag(tagId, updatedData);
    expect(Tag.findByPk).toHaveBeenCalledWith(tagId);
    expect(existingTag.update).toHaveBeenCalledWith(updatedData);
    expect(tag).toEqual(existingTag);
  });

  it("deleteTag should delete an existing tag", async () => {
    const tagId = uuidv4();
    const existingTag = {
      id: tagId,
      name: "Tag to be deleted",
      destroy: vi.fn(),
    };
    Tag.findByPk.mockResolvedValue(existingTag);

    const tag = await tagRepository.deleteTag(tagId);
    expect(Tag.findByPk).toHaveBeenCalledWith(tagId);
    expect(existingTag.destroy).toHaveBeenCalled();
    expect(tag).toEqual(existingTag);
  });
});
