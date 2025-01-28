import { useState, useEffect } from 'react';
import '../styles/NewsManagement.css';
import Notification from '../components/Notification';

function NewsManagement() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: '', // We'll handle this as a comma-separated string
  });
  const [editingPost, setEditingPost] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/posts/my-posts', {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const isEditing = !!editingPost;

      const url = isEditing
        ? `http://localhost:8080/api/posts/${editingPost._id}`
        : 'http://localhost:8080/api/posts';

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          ...newPost,
          tags: newPost.tags.split(',').map((tag) => tag.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error(
          isEditing ? 'Failed to update post' : 'Failed to create post'
        );
      }

      setNotification({
        type: 'success',
        message: isEditing
          ? 'Post updated successfully!'
          : 'Post created successfully!',
      });

      fetchPosts();
      setNewPost({ title: '', content: '', tags: '' });
      setEditingPost(null);
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message,
      });
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      tags: post.tags.join(', '),
    });
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8080/api/posts/${postId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setNotification({
        type: 'success',
        message: 'Post deleted successfully!',
      });

      fetchPosts();
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message,
      });
    }
  };

  const handleCancel = () => {
    setEditingPost(null);
    setNewPost({ title: '', content: '', tags: '' });
  };

  return (
    <div className="news-management">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="news-container">
        <h2>Quản lý tin tức</h2>

        {/* Add New Post Form */}
        <div className="article-form">
          <h3>{editingPost ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Tiêu đề"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Nội dung"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Tags (separated by commas)"
                value={newPost.tags}
                onChange={(e) =>
                  setNewPost({ ...newPost, tags: e.target.value })
                }
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-button">
                {editingPost ? 'Cập nhật' : 'Đăng bài'}
              </button>
              {editingPost && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Posts List */}
        <div className="articles-list">
          <h3>Bài viết đã đăng</h3>
          {posts.map((post) => (
            <div key={post._id} className="article-card">
              <h4>{post.title}</h4>
              <p>{post.content.substring(0, 100)}...</p>
              <div className="article-footer">
                <div className="tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="article-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(post)}
                  >
                    Sửa
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(post._id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsManagement;
