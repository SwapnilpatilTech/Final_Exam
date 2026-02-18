import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const RecipeForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    cookingTime: '',
    servings: '',
    difficulty: 'Easy',
    ingredients: '',
    instructions: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const recipe = response.data;
      setFormData({
        title: recipe.title || '',
        description: recipe.description || '',
        category: recipe.category || '',
        cookingTime: recipe.cookingTime || '',
        servings: recipe.servings || '',
        difficulty: recipe.difficulty || 'Easy',
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : '',
        instructions: recipe.instructions || '',
        imageUrl: recipe.imageUrl || ''
      });
      setInitialLoading(false);
    } catch (err) {
      setError('Failed to load recipe');
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Convert ingredients from newline-separated string to array
    const ingredientsArray = formData.ingredients
      .split('\n')
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      };

      const recipeData = {
        ...formData,
        ingredients: ingredientsArray,
        cookingTime: parseInt(formData.cookingTime),
        servings: parseInt(formData.servings)
      };

      if (isEdit) {
        await axios.put(`http://localhost:3000/recipes/${id}`, recipeData, config);
      } else {
        await axios.post('http://localhost:3000/recipes', recipeData, config);
      }

      navigate('/my-recipes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="container">
        <div className="loading">Loading recipe...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>{isEdit ? '✏️ Edit Recipe' : '➕ Add New Recipe'}</h1>
        <p>{isEdit ? 'Update your recipe details' : 'Share your delicious recipe with the community'}</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Recipe Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter recipe title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Dessert">Dessert</option>
              <option value="Snack">Snack</option>
              <option value="Beverage">Beverage</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Describe your recipe"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cookingTime">Cooking Time (minutes) *</label>
            <input
              type="number"
              id="cookingTime"
              name="cookingTime"
              value={formData.cookingTime}
              onChange={handleChange}
              required
              min="1"
              placeholder="e.g., 30"
            />
          </div>

          <div className="form-group">
            <label htmlFor="servings">Servings *</label>
            <input
              type="number"
              id="servings"
              name="servings"
              value={formData.servings}
              onChange={handleChange}
              required
              min="1"
              placeholder="e.g., 4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Difficulty *</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">Ingredients * (one per line)</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Enter each ingredient on a new line&#10;e.g.,&#10;2 cups flour&#10;1 tsp salt&#10;3 eggs"
          />
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions *</label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            required
            rows="8"
            placeholder="Step-by-step instructions for preparing the recipe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL (optional)</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Recipe' : 'Create Recipe')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
