import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts/my-posts', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '50px auto', padding: '20px' }}>
      <h1>CMS Dashboard</h1>
      <div style={{ display: 'inline', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ marginRight: '10px' }}>Welcome, {user?.name}</span>
        </div>
      </div>

      {user?.role !== 'viewer' && (
        <button
          onClick={() => navigate('/create-post')}
          style={{ margin: '20px 0', padding: '10px 20px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
        >
          + New Post
        </button>
      )}

      <h3>Published Posts</h3>
{posts.filter(p => p.status === 'published').length === 0 && <p>No published posts yet.</p>}
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
  {posts.filter(p => p.status === 'published').map((post) => (
    <div key={post._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '7px', position: 'relative' }}>
      <span style={{ position: 'absolute', top: '8px', right: '12px', fontSize: '11px', color: '#6B7280' }}>
        {post.author?.name}
      </span>
      {post.image && (
        <img
          src={`http://localhost:5000${post.image}`}
          alt={post.title}
          style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
        />
      )}
      <h4>{post.title}</h4>
      <p>{post.content}</p>
      <p><strong>Category:</strong> {post.category} | <span style={{ background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>Published</span></p>
      {user?.role !== 'viewer' && (
        <>
          <button onClick={() => navigate(`/edit-post/${post._id}`)} style={{ padding: '6px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>
            Edit
          </button>
          <button onClick={() => handleDelete(post._id)} style={{ padding: '6px 12px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Delete
          </button>
        </>
      )}
    </div>
  ))}
</div>

{user?.role !== 'viewer' && (
  <>
    <h3>My Drafts</h3>
    {posts.filter(p => p.status === 'draft').length === 0 && <p>No drafts.</p>}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
      {posts.filter(p => p.status === 'draft').map((post) => (
        <div key={post._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '7px', position: 'relative' }}>
          <span style={{ position: 'absolute', top: '8px', right: '12px', fontSize: '11px', color: '#6B7280' }}>
            {post.author?.name}
          </span>
          {post.image && (
            <img
              src={`http://localhost:5000${post.image}`}
              alt={post.title}
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
            />
          )}
          <h4>{post.title}</h4>
          <p>{post.content}</p>
          <p><strong>Category:</strong> {post.category} | <span style={{ background: '#F3F4F6', color: '#6B7280', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>Draft</span></p>
          <button onClick={() => navigate(`/edit-post/${post._id}`)} style={{ padding: '6px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>
            Edit
          </button>
          <button onClick={() => handleDelete(post._id)} style={{ padding: '6px 12px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Delete
            
          </button>
        </div>
      ))}
    </div>
  </>
)}
      <button onClick={handleLogout} style={{ position: 'relative', top: '20px', padding: '8px 20px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;