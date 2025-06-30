import React from 'react';

interface SpaceInitProps {
  spaceName: string;
  avatarUrl: string;
  handleClick: () => void;
}

export const SpaceInit: React.FC<SpaceInitProps> = ({ spaceName, avatarUrl, handleClick }) => {
  return (
    <div className="space-init" onClick={handleClick}>
      <div className="space-info">
        <img src={avatarUrl} alt={`${spaceName} avatar`} className="space-avatar" />
        <h3>{spaceName}</h3>
      </div>
    </div>
  );
};