import * as React from "react";
import { BACKEND_URL } from "../../lib/config"
import { LockKeyhole } from "lucide-react";

export function AuthPage({ signup }: { signup?: boolean }) {
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (signup) {
            if (!firstName || !lastName || !email || !password) return;
        } else {
            if (!email || !password) return;
        }

        const endpoint = signup ? "signup" : "signin";
        const body = signup
            ? JSON.stringify({ username: email, firstName, lastName, email, password, type: "user" })
            : JSON.stringify({ username: email, password });

        const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body,
        });

        const data = await response.json();

        if (signup && response.status === 200) {
            alert("Signup Successful");
        } else if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "/";
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="flex flex-col items-center space-y-6">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <LockKeyhole className="h-6 w-6 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Portal</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {signup ? "Create your account" : "Sign in to your account"}
                    </p>
                </div>

                <div className="w-[350px] bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        {signup ? "Signup" : "Login"}
                    </h2>

                    <form className="space-y-4">
                        <div className="flex flex-col space-y-1">
                            {/* Email */}
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="you@example.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            {signup && (
                                <>
                                    {/* First Name */}
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">
                                        First Name
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        required
                                        className="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="John"
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />

                                    {/* Last Name */}
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        required
                                        className="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Doe"
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </>
                            )}
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                placeholder="Enter your password"
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            onClick={(e) => {
                                setLoading(true);
                                handleSubmit(e);
                                setLoading(false);
                            }}
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 disabled:opacity-50"
                        >
                            {loading ? "Loading..." : signup ? "Signup" : "Login"}
                        </button>
                    </form>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {signup ? "Already have an account?" : "Don't have an account?"}{" "}
                        <a
                            href={signup ? "/login" : "/signup"}
                            className="text-blue-500 hover:underline"
                        >
                            {signup ? "Login" : "Signup"}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
