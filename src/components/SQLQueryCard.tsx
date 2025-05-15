import React, { useState } from 'react';
import { SQLQuery } from '../types';

interface SQLQueryCardProps {
  query: SQLQuery;
}

const SQLQueryCard: React.FC<SQLQueryCardProps> = ({ query }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-gray-800 font-medium">{query.name}</h3>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            {isExpanded ? 'Hide SQL' : 'Show SQL'}
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-1">{query.description}</p>
      </div>
      
      {isExpanded && (
        <div className="bg-gray-900 p-4 overflow-x-auto">
          <pre className="text-gray-100 text-sm font-mono whitespace-pre-wrap">{query.query}</pre>
        </div>
      )}
    </div>
  );
};

export default SQLQueryCard;