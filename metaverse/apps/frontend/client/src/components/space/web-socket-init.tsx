import React, { useEffect, useRef } from 'react';
import { SpaceElement, SpaceElementsState } from '../../types';

interface WebSocketInitProps {
  spaceId: string;
  token: string;
}

const WebSocketInit: React.FC<WebSocketInitProps> = ({ spaceId, token }) => {
  const [, setSpaceElements] = React.useState<SpaceElementsState>({});
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3001/spaces/${spaceId}`);

    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SpaceElement;
        setSpaceElements((prev: SpaceElementsState) => ({
          ...prev,
          [data.id]: data
        }));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [spaceId]);

  // Send initial connection message
  useEffect(() => {
    if (wsRef.current) {
      const message = {
        type: 'connect',
        spaceId,
        token,
        timestamp: new Date().toISOString()
      };
      wsRef.current.send(JSON.stringify(message));
    }
  }, [spaceId]);

  return null; // This component only handles WebSocket connection
};

export { WebSocketInit };
export default WebSocketInit;