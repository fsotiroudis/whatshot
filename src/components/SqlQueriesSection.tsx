import React from 'react';
import { Database } from 'lucide-react';
import SQLQueryCard from './SQLQueryCard';
import { SQLQuery, VesselType } from '../types';
import { generateMockSQLQueries } from '../utils/dataUtils';

interface SqlQueriesSectionProps {
  vesselType: VesselType;
}

const SqlQueriesSection: React.FC<SqlQueriesSectionProps> = ({ vesselType }) => {
  const queries: SQLQuery[] = generateMockSQLQueries(vesselType);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
      <div className="flex items-center mb-4">
        <Database className="text-blue-600 mr-2" size={20} />
        <h3 className="text-lg font-medium text-gray-800">SQL Queries for Data Warehouse</h3>
      </div>
      
      <div className="space-y-4">
        {queries.map((query, index) => (
          <SQLQueryCard key={index} query={query} />
        ))}
      </div>
    </div>
  );
};

export default SqlQueriesSection;