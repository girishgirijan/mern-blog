import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (req.user.id !== userId) {
      return next(
        errorHandler(403, "You are not authorized to create this comment")
      );
    }
    if(!content){
      return next(
        errorHandler(403, "Please fill comment section")
      );
    }

    if(Comment.length > 200){
      return next(
        errorHandler(403, "Comment length can not be more than 200")
      );
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};
