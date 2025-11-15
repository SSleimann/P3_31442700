import { expect, it, describe, beforeEach, vi } from "vitest";

import { v4 as uuidv4 } from "uuid";

import Category from "../src/models/category.js";
import CategoryRepository from "../src/repositories/category.repository.js";

vi.mock("../src/models/category.js", () => {
  return {
    default: {
      create: vi.fn(),
      findByPk: vi.fn(),
    },
  };
});

describe("CategoryRepository", () => {
  let categoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryRepository();
    vi.mocked(Category.create).mockReset();
    vi.mocked(Category.findByPk).mockReset();
  });

  it("createCategory should create a new category", async () => {
    const categoryData = {
      name: "Electronics",
      description: "Electronic items",
    };
    const mockCategory = { id: uuidv4(), ...categoryData };
    Category.create.mockResolvedValue(mockCategory);
    const category = await categoryRepository.createCategory(categoryData);
    expect(Category.create).toHaveBeenCalledWith(categoryData);
    expect(category).toEqual(mockCategory);
  });

  it("getCategoryById should return a category by ID", async () => {
    const categoryId = uuidv4();
    const mockCategory = {
      id: categoryId,
      name: "Books",
      description: "All kinds of books",
    };
    Category.findByPk.mockResolvedValue(mockCategory);
    const category = await categoryRepository.getCategoryById(categoryId);
    expect(Category.findByPk).toHaveBeenCalledWith(categoryId);
    expect(category).toEqual(mockCategory);
  });

  it("updateCategory should update an existing category", async () => {
    const categoryId = uuidv4();
    const existingCategory = {
      id: categoryId,
      name: "Clothing",
      description: "Apparel and garments",
      update: vi.fn(),
    };

    Category.findByPk.mockResolvedValue(existingCategory);
    const updatedData = {
      name: "Updated Clothing",
      description: "Updated description",
    };

    const category = await categoryRepository.updateCategory(
      categoryId,
      updatedData
    );

    expect(Category.findByPk).toHaveBeenCalledWith(categoryId);
    expect(existingCategory.update).toHaveBeenCalledWith(updatedData);
    expect(category).toEqual(existingCategory);
  });

  it("deleteCategory should delete an existing category", async () => {
    const categoryId = uuidv4();
    const existingCategory = {
      id: categoryId,
      name: "Toys",
      description: "Children toys",
      destroy: vi.fn(),
    };
    Category.findByPk.mockResolvedValue(existingCategory);

    const category = await categoryRepository.deleteCategory(categoryId);

    expect(Category.findByPk).toHaveBeenCalledWith(categoryId);
    expect(existingCategory.destroy).toHaveBeenCalled();
    expect(category).toEqual(existingCategory);
  });
});
