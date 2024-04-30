import React, { useEffect, useState } from "react";
import moment from 'moment'

export default function Comment({ singleComment }) {
  const [user, setUser] = useState({});

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
            <span className="font-bold mr-1 text-xs truncate">{user ? `@${user.username}` : 'anonymous user'}</span>
            <span className="text-gray-500 text-xs">
            {moment(singleComment.createdAt).fromNow()}
            </span>
        </div>
        <p className="text-gray-500 pb-2">{singleComment.content}</p>
      </div>
    </div>
  );
}
