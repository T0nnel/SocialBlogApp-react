import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import Editor from "../components/Editor";

export default function Create() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("content", content);
    if (files.length > 0) {
      formData.append("file", files[0]);
    }

    try {
      const response = await fetch("http://localhost:3000/post", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <input
        type="text"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />

      <input
        type="file"
        onChange={(ev) => setFiles(ev.target.files)}
      />

      <Editor value={content} onChange={setContent} />

      <button style={{ marginTop: "10px" }}>Create Blog Post</button>
    </form>
  );
}
