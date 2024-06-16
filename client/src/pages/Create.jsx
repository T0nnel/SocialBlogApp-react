import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Create = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null); // State for file
  const navigate = useNavigate();

  async function createNewPost(ev) {
    ev.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch('http://localhost:3000/create', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Post created successfully');
        navigate('/'); // Redirect to "/" after successful creation
      } else {
        console.error('Failed to create post:', response.status);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <br />
      <input type="file" onChange={(ev) => setFile(ev.target.files[0])} />
      <br />
      <ReactQuill value={content} onChange={(value) => setContent(value)} />
      <br />
      <button type="submit" style={{ marginTop: '10px' }}>
        Create blog post
      </button>
    </form>
  );
};

export default Create;

