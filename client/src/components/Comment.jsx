import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Spinner, Textarea } from "flowbite-react";

export default function Comment({ singleComment, onLike, onEdit }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditting, setIsEditting] = useState(false);
  const [editedContent, setEditedContent] = useState(singleComment.content);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${singleComment.userId}`);
        const data = await res.json();

        if (data.success === false) {
          return;
        }
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [singleComment]);
  //Edit comment
  const handleEdit = async () => {
    setIsEditting(true);
    setEditedContent(singleComment.content);
  };

  //Updating commet
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comment/editComment/${singleComment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      setIsEditting(false);
      onEdit(singleComment, editedContent);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(singleComment.createdAt).fromNow()}
          </span>
        </div>
        {isEditting ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              disabled={loading}
            ></Textarea>
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                {loading ? (
                  <>
                    <Spinner size="xs" />
                    <span className="pl-3">Saving</span>
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                disabled={loading}
                onClick={() => {
                  setIsEditting(false);
                  setEditedContent(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{singleComment.content}</p>
            <div className="flex gap-1 items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit">
              <button
                type="button"
                onClick={() => onLike(singleComment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  singleComment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {singleComment.numberOfLikes > 0 &&
                  singleComment.numberOfLikes +
                    " " +
                    (singleComment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === singleComment.userId ||
                  currentUser.isAdmin) && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-blue-500"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
