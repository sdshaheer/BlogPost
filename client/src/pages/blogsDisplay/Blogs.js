import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classes from "./blogs.module.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const Blogs = (props) => {
  const navigate = useNavigate();

  const handleDetailView = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  return (
    <div className={classes.container}>
      {props.blogs.map((blog) => (
        <div key={blog._id} className={classes.blog}>
          <Card className={classes.cardContainer}>
            <Card.Img
              variant="top"
              className={classes.image}
              src={blog.image}
            />
            <Card.Body>
              <Card.Title className="text-center">{blog.category}</Card.Title>
              <Card.Text>
                <div className="d-flex flex-column">
                  <span className="text-center fs-5 p-2">
                    {blog.title}
                  </span>
                  <span className="d-flex justify-content-between">
                    posted on :{" "}
                    <span className={classes.innerSpan}>
                      {blog.createdAt.slice(0, 10)}
                    </span>{" "}
                  </span>
                </div>
              </Card.Text>
              <Button
                variant="primary"
                className={classes.readMore}
                onClick={() => handleDetailView(blog._id)}
              >
                Read more
              </Button>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Blogs;
