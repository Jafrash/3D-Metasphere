"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

interface User {
  id: string
  role: "User" | "Admin"
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, password: string, type: "user" | "admin") => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // Validate token and set user
      axios
        .get("http://localhost:3000/api/v1/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data.user)
        })
        .catch(() => {
          localStorage.removeItem("token")
        })
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/signin", { username, password })
      localStorage.setItem("token", response.data.token)
      setUser(response.data.user)
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const signup = async (username: string, password: string, type: "user" | "admin") => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/signup", { username, password, type })
      localStorage.setItem("token", response.data.token)
      setUser(response.data.user)
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>
}