import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";
import { AiFillCopy } from "react-icons/ai";
import classes from "./createBlog.module.css";

const MarkDown = ({ children }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={classes.markDown}>
      <ReactMarkdown
        children={children}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <div className={classes.parent}>
                <CopyToClipboard text={children} className={classes.child}>
                  <AiFillCopy
                    style={{ color: "white", cursor: "pointer" }}
                    onClick={handleCopy}
                    className={classes.copyBoard}
                  />
                </CopyToClipboard>
                <div>
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    style={vscDarkPlus}
                    language={match[1]}
                    {...props}
                  />
                </div>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
};

export default MarkDown;
