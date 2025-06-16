import { useState, useEffect } from 'react'
import axios from 'axios'
import { ElementInterface as Element } from '@/lib/types'
import { Button } from '@headlessui/react'

export function ElementManagement() {
  const [elements, setElements] = useState<Element[]>([])
  const [newElement, setNewElement] = useState({
    name: '',
    width: 100,
    height: 100,
    static: true,
    imageUrl: ''
  })

  useEffect(() => {
    fetchElements()
  }, [])

  const fetchElements = async () => {
    try {
      const response = await axios.get('/api/elements')
      setElements(response.data)
    } catch (error) {
      console.error('Error fetching elements:', error)
    }
  }

  const createElement = async () => {
    try {
      await axios.post('/api/elements', newElement)
      setNewElement({
        name: '',
        width: 100,
        height: 100,
        static: true,
        imageUrl: ''
      })
      fetchElements()
    } catch (error) {
      console.error('Error creating element:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Element</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={newElement.name}
              onChange={(e) => setNewElement({ ...newElement, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Width</label>
            <input
              type="number"
              value={newElement.width}
              onChange={(e) => setNewElement({ ...newElement, width: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Height</label>
            <input
              type="number"
              value={newElement.height}
              onChange={(e) => setNewElement({ ...newElement, height: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="block text-sm font-medium text-gray-700">Static</label>
            <input
              type="checkbox"
              checked={newElement.static}
              onChange={(e) => setNewElement({ ...newElement, static: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              value={newElement.imageUrl}
              onChange={(e) => setNewElement({ ...newElement, imageUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <Button
            onClick={createElement}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Element
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Existing Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {elements.map((element) => (
            <div key={element.id} className="bg-white shadow rounded-lg p-4">
              <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={element.imageUrl}
                  alt={element.name}
                  className="object-cover"
                />
              </div>
              <div className="mt-2">
                <h3 className="font-medium">{element.name}</h3>
                <p className="text-sm text-gray-500">{element.width}x{element.height}</p>
              </div>
              <div className="mt-2 space-x-2">
                <Button className="px-2 py-1 text-sm text-indigo-600 hover:text-indigo-800">
                  View
                </Button>
                <Button className="px-2 py-1 text-sm text-red-600 hover:text-red-800">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
