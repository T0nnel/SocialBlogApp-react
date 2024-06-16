import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';
import './home.css'

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      // Initialize comments array for each post
      const postsWithComments = data.map(post => ({
        ...post,
        comments: []  // Initialize comments array
      }));
      setPosts(postsWithComments);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        return {
          ...post,
          likes: post.likes + 1
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleComment = (postId, commentText) => {
    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        return {
          ...post,
          comments: [...post.comments, { text: commentText }]  // Add new comment
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  return (
    <div>
      <Banner />
      <h2>All Posts</h2>
      <div className="for-the-posts">
        {posts.map(post => (
          <div key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <hr />
            <div className="post-extras">
              <p>Likes: {post.likes}</p>
              <button className='likebtn' onClick={() => handleLike(post._id)}>Like</button>
              <div className="comment-section">
                <input type="text" placeholder="Add a comment..." />
                <button onClick={() => handleComment(post._id, 'Sample comment')}>
                  Comment
                </button>
                <ul>
                  {post.comments.map((comment, index) => (
                    <li key={index}>{comment.text}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;








