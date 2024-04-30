import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getComments = async () => {
      setCommentError("");
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (data.success === false) {
          setCommentError(data.message);
          return;
        }
        setComments(data);
        setCommentError("");
      } catch (error) {
        setCommentError(error.message);
      }
    };
    getComments();
  }, [postId]);

  //Creating a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCommentError("");
    try {
      if (comment.length > 200) {
        setCommentError("Comment length can not be more than 200");
        return;
      }

      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        setCommentError(data.message);
        return;
      }
      setComments([data, ...comments]);
      setComment("");
    } catch (error) {
      setCommentError(error.message);
    }
  };

  //Handle Likes
  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        setCommentError("You need to login to make the comment like");
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (data.success === false) {
        setCommentError(data.message);
        return;
      }

      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: data.likes,
                numberOfLikes: data.numberOfLikes,
              }
            : comment
        )
      );
    } catch (error) {
      setCommentError(error.message);
    }
  };
  return (
    <div className=" mx-auto w-full mt-4">
      {currentUser ? (
        <div className="flex items-center gap-1">
          <p>Singed In as:</p>
          <img
            className="h-5 w-5 rounded-full object-cover"
            src={currentUser.profilePicture}
            alt={currentUser.username}
          />
          <Link
            className="text-xs text-cyan-600 hover:underline"
            to="/dashboard?tab=profile"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-2">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3 mt-4"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} Characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-4">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((singleComment, index) => (
            <Comment
              key={index}
              singleComment={singleComment}
              onLike={handleLike}
            />
          ))}
        </>
      )}
    </div>
  );
}
