import { useState, useEffect } from 'react'
import axios from 'axios'
import { SpaceInterface as Space } from '@/lib/types'
import { Button } from '@headlessui/react'

export function SpaceManagement() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newSpace, setNewSpace] = useState<Space>({ 
    id: '',
    name: '', 
    width: 1000, 
    height: 1000,
    elements: []
  })

  // Type guard to ensure spaces is always an array
  const isSpaceArray = (value: any): value is Space[] => {
    return Array.isArray(value) && 
           value.every((item: any) => 
             typeof item === 'object' && 
             'id' in item && 
             'name' in item && 
             'width' in item && 
             'height' in item && 
             'elements' in item && 
             Array.isArray(item.elements));
  }

  useEffect(() => {
    fetchSpaces()
  }, [])

  const fetchSpaces = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get('/api/spaces')
      const data = response.data
      if (!isSpaceArray(data)) {
        console.error('Invalid spaces data format:', data)
        setError('Invalid spaces data format received from server')
        setSpaces([])
        return
      }
      setSpaces(data as Space[])
    } catch (error) {
      console.error('Error fetching spaces:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch spaces')
      setSpaces([])
    } finally {
      setLoading(false)
    }
  }

  const createSpace = async () => {
    try {
      await axios.post('/api/spaces', {
        name: newSpace.name,
        width: newSpace.width,
        height: newSpace.height,
        elements: []
      })
      setNewSpace({ 
        id: '',
        name: '', 
        width: 1000, 
        height: 1000,
        elements: []
      })
      fetchSpaces()
    } catch (error) {
      console.error('Error creating space:', error)
      setError(error instanceof Error ? error.message : 'Failed to create space')
    }
  }

  const handleEdit = (space: Space) => {
    setNewSpace({
      ...space,
      elements: space.elements || []
    })
  }

  const handleDelete = async (space: Space) => {
    if (!window.confirm(`Are you sure you want to delete space "${space.name}"?`)) {
      return
    }

    try {
      await axios.delete(`/api/spaces/${space.id}`)
      fetchSpaces()
    } catch (error) {
      console.error('Error deleting space:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete space')
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Create New Space</h2>
            <div className="flex items-center space-x-4">
              <Button
                onClick={createSpace}
                disabled={newSpace.name === '' || newSpace.width <= 0 || newSpace.height <= 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Space
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Space Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="name"
                  value={newSpace.name}
                  onChange={(e) => setNewSpace(prev => ({ ...prev, name: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter space name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700">
                Width (pixels)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="width"
                  value={newSpace.width}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setNewSpace(prev => ({ ...prev, width: value }));
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Height (pixels)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="height"
                  value={newSpace.height}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setNewSpace(prev => ({ ...prev, height: value }));
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Existing Spaces</h2>

          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading spaces...</p>
            </div>
          ) : spaces.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2">No spaces found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {spaces.map((space) => (
                <div key={space.id} className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{space.name}</h3>
                        <p className="text-gray-600">{space.width} x {space.height} pixels</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEdit(space)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(space)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
