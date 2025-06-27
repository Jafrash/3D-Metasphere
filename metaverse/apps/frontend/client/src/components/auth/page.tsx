import { useState } from "react";
import { BACKEND_URL } from "../../lib/config";
import { Globe2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export function AuthPage({ signup = false }: { signup?: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError(null);

    const endpoint = signup ? "signup" : "signin";
    const body = JSON.stringify(signup ? { username, password, type } : { username, password });

    try {
      console.log("Sending request to:", `${BACKEND_URL}/api/v1/${endpoint}`);
      console.log("Request body:", body);
      const response = await fetch(`${BACKEND_URL}/api/v1/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      const data = await response.json();

      if (response.ok) {
        if (signup) {
          alert("Signup Successful");
          localStorage.setItem("userId", data.userId);
          window.location.href = "/";
        } else {
          localStorage.setItem("token", data.token);
          window.location.href = "/";
        }
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Globe2 className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Metaverse</h1>
          <p className="mt-2 text-sm text-gray-600">
            {signup ? "Create your account" : "Sign in to your account"}
          </p>
        </div>
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {signup && (
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <div className="mt-1">
                  <select
                    id="type"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : signup ? "Signup" : "Login"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {signup ? "Already have an account?" : "Don't have an account?"}{" "}
              <Link to={signup ? "/" : "/signup"} className="font-medium text-blue-600 hover:text-blue-500">
                {signup ? "Login" : "Signup"}
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-500 text-sm">
          By continuing, you agree to VirtualMeet's{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-700">Terms of Service</a>{" "}
          and{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
