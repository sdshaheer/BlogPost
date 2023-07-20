import React from "react";
import classes from './pagination.module.css'
import { useState } from "react";

const Pagination = (props) => {
    const [page, setPage] = useState(1);
    const handlePage = (i) => {
        props.handleCurr(i)
      };
    
      const handlePrev = () => {
        props.handlePrev()
      };
      
      const handleNext = () => {
        props.handleNext()
      };
  return (
    <div>
      {props.pages > 0 && (
        <div className={classes.footer}>
          {props.currPage > 1 && <span onClick={handlePrev}>{"<<"}</span>}
          {[...Array(props.pages)].map((_, i) => {
            return (
              <span onClick={() => props.handleCurr(i + 1)} key={i + 1}>
                {i + 1}
              </span>
            );
          })}
          {props.currPage < props.pages && <span onClick={handleNext}>{">>"}</span>}
        </div>
      )}
    </div>
  );
};

export default Pagination;
