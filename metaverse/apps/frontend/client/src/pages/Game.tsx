import React, { useRef, useEffect } from 'react'
declare namespace JSX {
  interface IntrinsicElements {
    div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    canvas: React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
  }
}
import { useAuth } from '../lib/auth'
import { socket } from '../lib/socket'
import { Space } from '../types'
import Phaser from 'phaser'

interface GameProps {
  space: Space
}

export function Game({ space }: GameProps) {
  const { user } = useAuth()
  const gameRef = useRef<HTMLCanvasElement>(null)

  // Phaser Scene class

  class GameScene extends Phaser.Scene {
    private player?: Phaser.Physics.Arcade.Sprite
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys

    constructor() {
      super('GameScene')
    }

    preload() {
      this.load.image('player', '/assets/player.png')
      this.load.image('floor', '/assets/floor.png')
    }

    create() {
      if (!user) return

      // Create player
      this.player = this.physics.add.sprite(100, 100, 'player')
      this.player.setCollideWorldBounds(true)

      // Connect to socket
      socket.emit('join-space', user.id)

      // Handle movement
      if (this.input?.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys()

        socket.on('player-move', (position) => {
          // Handle other players' movements
        })
      }
    }

    update() {
      if (!this.player || !this.cursors) return

      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160)
        socket.emit('move', { x: this.player.x, y: this.player.y })
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160)
        socket.emit('move', { x: this.player.x, y: this.player.y })
      } else {
        this.player.setVelocityX(0)
      }

      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-160)
        socket.emit('move', { x: this.player.x, y: this.player.y })
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(160)
        socket.emit('move', { x: this.player.x, y: this.player.y })
      } else {
        this.player.setVelocityY(0)
      }
    }
  }

  const handlePlayerMove = (position: any) => {
    // Handle other players' movements
  }

  useEffect(() => {
    if (!gameRef.current) return

    socket.on('player-move', handlePlayerMove)

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: GameScene,
    }

    const game = new Phaser.Game(config)

    return () => {
      socket.off('player-move', handlePlayerMove)
      game.destroy(true)
    }
  }, [])

  return (
    <div className="h-screen w-screen">
      <canvas ref={gameRef} />
    </div>
  )
}
