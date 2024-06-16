import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Banner from '../components/Banner';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading state
  const [error, setError] = useState(null); // State to track error

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true); // Set loading state to true
    try {
      const response = await fetch(`http://localhost:3000/post/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      const data = await response.json();
      setPost(data);
      setLoading(false); // Set loading state to false after successful fetch
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to fetch post. Please try again later.'); // Set error message
      setLoading(false); // Set loading state to false on error
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message if fetch failed
  }

  return (
    <>
      <Banner />
      <div>
        <h2>{post.title}</h2>
        <p>{post.summary}</p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        {post.cover && <img src={`http://localhost:3000/${post.cover}`} alt="Cover" />}
      </div>
    </>
  );
};

export default BlogPost;

