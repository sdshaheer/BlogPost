import React, { useEffect } from "react";
import classes from "./comment.module.css";
import { useState } from "react";
import axios from "axios";
import { getPostDate } from "../Verification";
import { useSelector } from "react-redux";
import { sortComments } from "../Verification";

const Comment = ({ blogDetails, commentBlog }) => {
  const loginUserName = useSelector((state) => state.auth.userName);
  console.log(loginUserName);
  const [textValue, setTextValue] = useState("");
  const [isCommented, setIsCommented] = useState(false);
  const [comments, setComments] = useState([]);

  const handleComment = () => {
    if (textValue == "") return;
    commentBlog(textValue);
    setTextValue('')
  };

  
  return (
    <div className={classes.container}>
      <span className="fs-4 fw-bolder">
        Comments ({blogDetails.comments.length})
      </span>
      <div className="d-flex flex-column">
        {!blogDetails.isOwner && (
          <>
            <span className="fs-5 fw-bold mt-2">{loginUserName}</span>
            <textarea
              className={classes.textarea}
              rows="5"
              cols="20"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Write a thoughtful comment"
            />
            <div className="d-flex justify-content-end mt-3 ">
              <button
                className="p-1 rounded-3 bg-primary text-white"
                onClick={handleComment}
              >
                comment
              </button>
            </div>
          </>
        )}
        <div className="mt-3">
          {sortComments(blogDetails.comments).map((comment) => {
            return (
              <div key={comment.name} className={classes.comment}>
                <div className={classes.name}>
                  <span className="fs-6">{comment.commentedUserName}</span>
                  <span>{getPostDate(comment.commentedAt)}</span>
                </div>
                <div className="mt-2">{comment.message}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Comment;
