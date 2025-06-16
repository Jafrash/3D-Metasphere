import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import { Space, Element } from '../types'

interface SpaceProps {
  space: Space
}

export function SpaceComponent({ space }: SpaceProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchElements = async () => {
      try {
        const response = await axios.get(`/api/spaces/${space.id}/elements`)
        const elements = response.data as Element[]
        
        // Add elements to the space
        elements.forEach(element => {
          const elementDiv = document.createElement('div')
          elementDiv.style.position = 'absolute'
          elementDiv.style.left = `${element.x}px`
          elementDiv.style.top = `${element.y}px`
          elementDiv.style.width = `${element.width}px`
          elementDiv.style.height = `${element.height}px`
          elementDiv.style.backgroundImage = `url(${element.imageUrl})`
          elementDiv.style.backgroundSize = 'contain'
          elementDiv.style.backgroundPosition = 'center'
          elementDiv.style.backgroundRepeat = 'no-repeat'
          elementDiv.style.pointerEvents = element.static ? 'auto' : 'none'
          
          if (containerRef.current) {
            containerRef.current.appendChild(elementDiv)
          }
        })
      } catch (error) {
        console.error('Error fetching elements:', error)
      }
    }

    fetchElements()
  }, [space.id])

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        width: `${space.width}px`,
        height: `${space.height}px`,
        background: '#f0f0f0',
        overflow: 'hidden',
      }}
    >
      {/* Elements will be added here dynamically */}
    </div>
  )
}
