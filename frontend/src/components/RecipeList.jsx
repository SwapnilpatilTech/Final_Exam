import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/recipes');
      setRecipes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch recipes');
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || recipe.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>🍳 All Recipes</h1>
        <p>Discover delicious recipes from our community</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
          <option value="Snack">Snack</option>
          <option value="Beverage">Beverage</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {filteredRecipes.length > 0 ? (
        <div className="recipe-grid">
          {filteredRecipes.map(recipe => (
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
                <div className="recipe-author">
                  By {recipe.author?.username || 'Unknown'}
                </div>
                <Link to={`/recipes/${recipe._id}`} className="btn btn-secondary">
                  View Recipe
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">🍳</span>
          <h2>No recipes found</h2>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default RecipeList;
