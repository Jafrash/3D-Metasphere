"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"

const AdminPanel: React.FC = () => {
  const [elementName, setElementName] = useState("")
  const [elementWidth, setElementWidth] = useState("")
  const [elementHeight, setElementHeight] = useState("")
  const [elementStatic, setElementStatic] = useState(false)
  const [elementImageUrl, setElementImageUrl] = useState("")

  const [avatarName, setAvatarName] = useState("")
  const [avatarImageUrl, setAvatarImageUrl] = useState("")

  const [mapName, setMapName] = useState("")
  const [mapDimensions, setMapDimensions] = useState("")
  const [mapThumbnail, setMapThumbnail] = useState("")

  const handleCreateElement = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(
        "http://localhost:3000/api/v1/admin/element",
        {
          name: elementName,
          width: Number(elementWidth),
          height: Number(elementHeight),
          static: elementStatic,
          imageUrl: elementImageUrl,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      alert("Element created successfully")
    } catch (error) {
      console.error("Failed to create element:", error)
      alert("Failed to create element")
    }
  }

  const handleCreateAvatar = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(
        "http://localhost:3000/api/v1/admin/avatar",
        {
          name: avatarName,
          imageUrl: avatarImageUrl,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      alert("Avatar created successfully")
    } catch (error) {
      console.error("Failed to create avatar:", error)
      alert("Failed to create avatar")
    }
  }

  const handleCreateMap = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(
        "http://localhost:3000/api/v1/admin/map",
        {
          name: mapName,
          dimensions: mapDimensions,
          thumbnail: mapThumbnail,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      alert("Map created successfully")
    } catch (error) {
      console.error("Failed to create map:", error)
      alert("Failed to create map")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold mb-6">Admin Panel</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-xl font-semibold">Create Element</h2>
                <form onSubmit={handleCreateElement} className="space-y-4">
                  {/* Element form fields */}
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Element
                  </button>
                </form>
              </div>
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-xl font-semibold">Create Avatar</h2>
                <form onSubmit={handleCreateAvatar} className="space-y-4">
                  {/* Avatar form fields */}
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Avatar
                  </button>
                </form>
              </div>
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-xl font-semibold">Create Map</h2>
                <form onSubmit={handleCreateMap} className="space-y-4">
                  {/* Map form fields */}
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Map
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel

