import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthTest: React.FC = () => {
  const { isAuthenticated, user, login, logout } = useAuth();

  const handleTestLogin = () => {
    const testUser = {
      id: '1',
      email: 'admin@ena.cd',
      firstName: 'Victor',
      lastName: 'Bafuafua',
      role: 'Directeur',
      loginTime: new Date().toISOString()
    };
    login(testUser);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Test d'authentification</h3>
      
      <div className="space-y-4">
        <div>
          <strong>Statut:</strong> {isAuthenticated ? '✅ Connecté' : '❌ Déconnecté'}
        </div>
        
        {user && (
          <div>
            <strong>Utilisateur:</strong> {user.firstName} {user.lastName} ({user.role})
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={handleTestLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Login
          </button>
          
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
