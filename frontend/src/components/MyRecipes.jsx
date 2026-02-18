import { useState, useEffect } from 'react';
import axios from 'axios';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyRecipes();
  }, [navigate]);

  const fetchMyRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/recipes/my/recipes', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setRecipes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch your recipes');
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/recipes/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
    } catch (err) {
      setError('Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your recipes...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>👨‍🍳 My Recipes</h1>
        <p>Manage your culinary creations</p>
        <Link to="/recipes/create" className="btn btn-primary">
          ➕ Add New Recipe
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {recipes.length > 0 ? (
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <div key={recipe._id} className="recipe-card">
              <div className="recipe-image">
                <img 
                  src={recipe.imageUrl || '/images/default-recipe.jpg'} 
                  alt={recipe.title}
                  onError={(e) => e.target.src = '/images/default-recipe.jpg'}
                />
                <span className="recipe-category">{recipe.category}</span>
              </div>
              <div className="recipe-content">
                <h3>{recipe.title}</h3>
                <p className="recipe-description">
                  {recipe.description.substring(0, 100)}...
                </p>
                <div className="recipe-meta">
                  <span className="meta-item">⏱️ {recipe.cookingTime} min</span>
                  <span className="meta-item">👤 {recipe.servings} servings</span>
                  <span className="meta-item">📊 {recipe.difficulty}</span>
                </div>
                <div className="recipe-actions">
                  <Link to={`/recipes/${recipe._id}`} className="btn btn-secondary">
                    View
                  </Link>
                  <Link to={`/recipes/${recipe._id}/edit`} className="btn btn-secondary">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(recipe._id)} 
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">🍳</span>
          <h2>You haven't created any recipes yet</h2>
          <p>Share your first recipe with the community!</p>
          <Link to="/recipes/create" className="btn btn-primary">
            Create Your First Recipe
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
