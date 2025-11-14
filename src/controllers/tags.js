import TagRepository from "../repositories/tags.repository.js";

const repo = new TagRepository();

const getAllTags = async (req, res) => {
  try {
    const tags = await repo.filterTags({});
    return res.status(200).json({
      status: "success",
      data: tags,
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch tags",
    });
  }
};

const getTagById = async (req, res) => {
  const { id } = req.params;

  try {
    const tag = await repo.getTagById(id);
    if (!tag) {
      return res.status(404).json({
        status: "error",
        message: "Tag not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: tag,
    });
  } catch (error) {
    console.error("Error fetching tag by ID:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch tag by ID",
    });
  }
};

const createTag = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "error",
      message: "Name is required",
    });
  }

  try {
    const newTag = await repo.createTag({
      name,
    });
    return res.status(201).json({
      status: "success",
      data: newTag,
    });
  } catch (error) {
    console.error("Error creating tag:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create tag",
    });
  }
};

const updateTag = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "error",
      message: "Name is required",
    });
  }

  try {
    const updatedTag = await repo.updateTag(id, {
      name,
    });

    if (!updatedTag) {
      return res.status(404).json({
        status: "error",
        message: "Tag not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: updatedTag,
    });
  } catch (error) {
    console.error("Error updating tag:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update tag",
    });
  }
};

const deleteTag = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTag = await repo.deleteTag(id);

    if (!deletedTag) {
      return res.status(404).json({
        status: "error",
        message: "Tag not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: deletedTag,
    });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete tag",
    });
  }
};

export { getAllTags, getTagById, createTag, updateTag, deleteTag };
