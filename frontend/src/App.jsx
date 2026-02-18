import { useState } from "react";
import axios from "axios";
import "./index.css";

const AUTH_API_URL = "http://localhost:3000/api/auth";
const RECIPE_API_URL = "http://localhost:3000/api/receipe";

function App() {
  const [activeTab, setActiveTab] = useState("login");
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const isDashboardView = user && activeTab === "dashboard";

  function clearMessages() {
    setError("");
    setMessage("");
  }

  async function fetchMyRecipes() {
    setRecipesLoading(true);
    try {
      const response = await axios.get(`${RECIPE_API_URL}/my`, {
        withCredentials: true,
      });
      setRecipes(response.data?.recipes || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to load dashboard recipes."
      );
    } finally {
      setRecipesLoading(false);
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await axios.post(`${AUTH_API_URL}/register`, registerData, {
        withCredentials: true,
      });
      setMessage(response.data?.message || "Registration successful.");
      setActiveTab("login");
      setLoginData({
        email: registerData.email,
        password: "",
      });
      setRegisterData({
        name: "",
        email: "",
        password: "",
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await axios.post(`${AUTH_API_URL}/login`, loginData, {
        withCredentials: true,
      });
      setUser(response.data?.user || null);
      setMessage(response.data?.message || "Login successful.");
      setLoginData({ email: "", password: "" });
      setActiveTab("dashboard");
      await fetchMyRecipes();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    clearMessages();
    setLoading(true);

    try {
      const response = await axios.post(
        `${AUTH_API_URL}/logout`,
        {},
        { withCredentials: true }
      );
      setMessage(response.data?.message || "Logged out.");
      setUser(null);
      setRecipes([]);
      setActiveTab("login");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Logout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={isDashboardView ? "page dashboard-page" : "page"}>
      <section className={isDashboardView ? "card dashboard-card" : "card"}>
        {!isDashboardView && (
          <>
            <h1>Recipe Auth</h1>
            <p className="sub">Frontend connected to backend auth APIs.</p>
          </>
        )}

        {message && <p className="notice success">{message}</p>}
        {error && <p className="notice error">{error}</p>}

        {isDashboardView ? (
          <div className="dashboard">
            <header className="dashboard-header">
              <div>
                <h1>Dashboard</h1>
                <p className="sub">
                  Welcome, <strong>{user.name}</strong> ({user.email})
                </p>
              </div>
              <div className="dashboard-actions">
                <button
                  className="dashboard-btn logout-btn"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {loading ? "Please wait..." : "Logout"}
                </button>
              </div>
            </header>

            <section className="summary-card">
              <h2>Your Recipes</h2>
              <p>Total recipes: {recipes.length}</p>
            </section>

            <section>
              {recipesLoading ? (
                <p>Loading recipes...</p>
              ) : recipes.length === 0 ? (
                <p>No recipes found.</p>
              ) : (
                <ul className="recipe-grid">
                  {recipes.map((recipe) => (
                    <li key={recipe._id} className="recipe-item">
                      <h3>{recipe.title || "Untitled Recipe"}</h3>
                      <p>{recipe.content || "No content"}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        ) : (
          <>
            {activeTab === "login" ? (
              <form onSubmit={handleLoginSubmit} className="form">
                <h2>Login</h2>
                <label>
                  Email
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(event) => {
                      setLoginData({
                        ...loginData,
                        email: event.target.value,
                      });
                    }}
                    required
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(event) => {
                      setLoginData({
                        ...loginData,
                        password: event.target.value,
                      });
                    }}
                    required
                  />
                </label>
                <button type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
                <p className="switch-text">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="switch-link"
                    onClick={() => {
                      clearMessages();
                      setActiveTab("register");
                    }}
                  >
                    Sign up
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="form">
                <h2>Sign up</h2>
                <label>
                  Name
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(event) => {
                      setRegisterData({
                        ...registerData,
                        name: event.target.value,
                      });
                    }}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(event) => {
                      setRegisterData({
                        ...registerData,
                        email: event.target.value,
                      });
                    }}
                    required
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(event) => {
                      setRegisterData({
                        ...registerData,
                        password: event.target.value,
                      });
                    }}
                    required
                  />
                </label>
                <button type="submit" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>
                <p className="switch-text">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="switch-link"
                    onClick={() => {
                      clearMessages();
                      setActiveTab("login");
                    }}
                  >
                    Login
                  </button>
                </p>
              </form>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default App;
