import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import Notification from '../components/Notification';

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [notification, setNotification] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/posts', {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message,
      });
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8080/api/posts/${postId}/like`,
        {
          method: 'POST',
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      fetchPosts(); // Refresh posts to show updated likes
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message,
      });
    }
  };

  const handleComment = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8080/api/posts/${postId}/comment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({ content: commentText }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      setCommentText('');
      setActiveCommentPost(null);
      fetchPosts(); // Refresh posts to show new comment
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message,
      });
    }
  };

  const getFilteredPosts = () => {
    if (!searchQuery.trim()) return posts;

    const query = searchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        post.author.username.toLowerCase().includes(query)
    );
  };

  return (
    <div className="dashboard">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="dashboard-container">
        <h1>Trang chủ</h1>

        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm bài viết..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="posts-list">
          {getFilteredPosts().map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <h3>{post.title}</h3>
                <span className="author">Đăng bởi: {post.author.username}</span>
                <span className="date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="post-content">
                <p>{post.content}</p>
              </div>

              <div className="tags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="post-interactions">
                <button
                  className={`like-button ${
                    post.likes.includes(
                      JSON.parse(
                        atob(localStorage.getItem('token').split('.')[1])
                      ).id
                    )
                      ? 'liked'
                      : ''
                  }`}
                  onClick={() => handleLike(post._id)}
                >
                  ❤️ {post.likes.length}
                </button>
                <button
                  className="comment-button"
                  onClick={() =>
                    setActiveCommentPost(
                      activeCommentPost === post._id ? null : post._id
                    )
                  }
                >
                  💬 {post.comments.length}
                </button>
              </div>

              {activeCommentPost === post._id && (
                <div className="comment-form">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Viết bình luận..."
                  />
                  <button onClick={() => handleComment(post._id)}>Gửi</button>
                </div>
              )}

              <div className="comments-section">
                {post.comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <strong>{comment.author.username}</strong>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
