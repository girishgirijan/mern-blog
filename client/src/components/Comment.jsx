import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Comment({ singleComment, onLike }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
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
        </div>
      </div>
    </div>
  );
}
