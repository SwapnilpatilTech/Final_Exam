import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RecipeItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/recipes/${id}`);
      setRecipe(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load recipe');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      navigate('/my-recipes');
    } catch (err) {
      setError('Failed to delete recipe');
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.post(`http://localhost:3000/recipes/${id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      fetchRecipe();
    } catch (err) {
      setError('Failed to like recipe');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.post(`http://localhost:3000/comments/recipes/${id}/comments`, 
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      setComment('');
      fetchRecipe();
    } catch (err) {
      setError('Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/comments/recipes/${id}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      fetchRecipe();
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isOwner = user && recipe?.author?._id === user.id;

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading recipe...</div>
      </div>
    );
  }

  if (error && !recipe) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
        <Link to="/recipes" className="btn btn-secondary">Back to Recipes</Link>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container">
        <div className="alert alert-error">Recipe not found</div>
        <Link to="/recipes" className="btn btn-secondary">Back to Recipes</Link>
      </div>
    );
  }

  return (
    <div className="container">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="recipe-detail">
        <Link to="/recipes" className="back-link">← Back to Recipes</Link>
        
        <div className="recipe-detail-header">
          <h1>{recipe.title}</h1>
          <div className="recipe-meta">
            <span className="meta-item">⏱️ {recipe.cookingTime} min</span>
            <span className="meta-item">👤 {recipe.servings} servings</span>
            <span className="meta-item">📊 {recipe.difficulty}</span>
            <span className="meta-item">🏷️ {recipe.category}</span>
          </div>
          <p className="recipe-author">
            By {recipe.author?.username || 'Unknown'} • {new Date(recipe.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="recipe-detail-image">
          <img 
            src={recipe.imageUrl || '/images/default-recipe.jpg'} 
            alt={recipe.title}
            onError={(e) => e.target.src = '/images/default-recipe.jpg'}
          />
        </div>

        <div className="recipe-detail-content">
          <div className="recipe-description">
            <h2>Description</h2>
            <p>{recipe.description}</p>
          </div>

          <div className="recipe-ingredients">
            <h2>🍳 Ingredients</h2>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="recipe-instructions">
            <h2>📝 Instructions</h2>
            <p>{recipe.instructions}</p>
          </div>

          <div className="recipe-actions">
            {isOwner && (
              <>
                <Link to={`/recipes/${recipe._id}/edit`} className="btn btn-secondary">
                  Edit Recipe
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  Delete Recipe
                </button>
              </>
            )}
            {user && (
              <button onClick={handleLike} className="btn btn-secondary">
                {recipe.likes?.includes(user.id) ? '❤️ Unlike' : '🤍 Like'}
              </button>
            )}
            <span className="like-count">{recipe.likes?.length || 0} likes</span>
          </div>
        </div>

        <div className="recipe-comments">
          <h2>💬 Comments ({recipe.comments?.length || 0})</h2>

          {user ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                required
              />
              <button type="submit" className="btn btn-primary">Post Comment</button>
            </form>
          ) : (
            <p><Link to="/login">Login</Link> to post a comment</p>
          )}

          {recipe.comments && recipe.comments.length > 0 ? (
            <div className="comments-list">
              {recipe.comments.map(comment => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-header">
                    <strong>{comment.author?.username || 'Unknown'}</strong>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                  {user && (user.id === comment.author?._id || user.id === recipe.author?._id || user.role === 'admin') && (
                    <button 
                      onClick={() => handleDeleteComment(comment._id)}
                      className="btn-link"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeItem;
