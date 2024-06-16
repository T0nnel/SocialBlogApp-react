import Post from "../components/post"; // Assuming correct path to Post component
import { useEffect, useState } from "react";
import Banner from '../components/Banner';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/post')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        return response.json();
      })
      .then(postsData => {
        setPosts(postsData);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        // Handle error (e.g., show a message to the user)
      });
  }, []); // Empty dependency array means this effect runs only once on component mount

  return (
    <>
      <Banner />
      {posts.length > 0 && posts.map(post => (
        <Post key={post.id} {...post} /> // Assuming each post has a unique 'id' property
      ))}
    </>
  );
}
