import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/models/category.js", () => ({
  default: {
    create: jest.fn(),
    findByPk: jest.fn(),
  },
}));

import { v4 as uuidv4 } from "uuid";
const Category = await import("../src/models/category.js");
const { default: CategoryRepository } = await import(
  "../src/repositories/category.repository.js"
);

describe("CategoryRepository", () => {
  let categoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryRepository();
    jest.clearAllMocks();
  });

  it("createCategory should create a new category", async () => {
    const categoryData = {
      name: "Electronics",
      description: "Electronic items",
    };
    const mockCategory = { id: uuidv4(), ...categoryData };
    Category.default.create.mockResolvedValue(mockCategory);
    const category = await categoryRepository.createCategory(categoryData);
    expect(Category.default.create).toHaveBeenCalledWith(categoryData);
    expect(category).toEqual(mockCategory);
  });

  it("getCategoryById should return a category by ID", async () => {
    const categoryId = uuidv4();
    const mockCategory = {
      id: categoryId,
      name: "Books",
      description: "All kinds of books",
    };
    Category.default.findByPk.mockResolvedValue(mockCategory);
    const category = await categoryRepository.getCategoryById(categoryId);
    expect(Category.default.findByPk).toHaveBeenCalledWith(categoryId);
    expect(category).toEqual(mockCategory);
  });

  it("updateCategory should update an existing category", async () => {
    const categoryId = uuidv4();
    const existingCategory = {
      id: categoryId,
      name: "Clothing",
      description: "Apparel and garments",
      update: jest.fn(),
    };

    Category.default.findByPk.mockResolvedValue(existingCategory);
    const updatedData = {
      name: "Updated Clothing",
      description: "Updated description",
    };

    const category = await categoryRepository.updateCategory(
      categoryId,
      updatedData
    );

    expect(Category.default.findByPk).toHaveBeenCalledWith(categoryId);
    expect(existingCategory.update).toHaveBeenCalledWith(updatedData);
    expect(category).toEqual(existingCategory);
  });

  it("deleteCategory should delete an existing category", async () => {
    const categoryId = uuidv4();
    const existingCategory = {
      id: categoryId,
      name: "Toys",
      description: "Children toys",
      destroy: jest.fn(),
    };
    Category.default.findByPk.mockResolvedValue(existingCategory);

    const category = await categoryRepository.deleteCategory(categoryId);

    expect(Category.default.findByPk).toHaveBeenCalledWith(categoryId);
    expect(existingCategory.destroy).toHaveBeenCalled();
    expect(category).toEqual(existingCategory);
  });
});
