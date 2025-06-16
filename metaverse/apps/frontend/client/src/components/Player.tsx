import React from 'react'
import { Player as PlayerType } from '../types'

interface PlayerProps {
  player: PlayerType
  isLocal: boolean
}

export function Player({ player, isLocal }: PlayerProps) {
  return (
    <div
      className={`absolute transition-transform duration-100 ${isLocal ? 'ring-2 ring-indigo-500' : ''}`}
      style={{
        left: `${player.position.x}px`,
        top: `${player.position.y}px`,
        width: '40px',
        height: '40px',
        background: 'url(/assets/player.png) center/contain',
        pointerEvents: 'none',
      }}
    >
      {isLocal && (
        <div className="absolute -top-6 -left-6 w-8 h-8 rounded-full bg-indigo-500/50 border-2 border-indigo-500 animate-pulse"></div>
      )}
    </div>
  )
}
