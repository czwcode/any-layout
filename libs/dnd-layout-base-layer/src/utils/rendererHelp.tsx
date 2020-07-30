import React from 'react';

export const defaultAtomRenderer = ({ node, width, height }) => {
  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {node.id}
    </div>
  );
};
