import React, { useState } from 'react';
import { 
  DocumentTextIcon,
  CloudArrowUpIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { mockDocuments, mockEmployees } from '../../data/mockData';
import FileDropZone from '../../components/FileDropZone';
import ExportMenu from '../../components/ExportMenu';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { useToast } from '../../hooks/useToast';
import type { Document } from '../../types';

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showUploadZone, setShowUploadZone] = useState(false);
  const { showToast } = useToast();

  const handleFilesUploaded = (files: { file: File; name: string; size: string }[]) => {
    // Simuler l'ajout des nouveaux documents
    const newDocuments: Document[] = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      type: 'other' as Document['type'],
      size: file.file.size,
      url: '#', // URL simulée
      employeeId: 'emp1', // Par défaut
      uploadDate: new Date(),
      isConfidential: false
    }));

    setDocuments(prev => [...newDocuments, ...prev]);
    showToast('success', 'Upload réussi', `${files.length} fichier(s) ajouté(s)`);
    setShowUploadZone(false);
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Inconnu';
  };

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'contract':
        return DocumentTextIcon;
      case 'cv':
        return DocumentTextIcon;
      case 'certificate':
        return DocumentTextIcon;
      case 'id_copy':
        return DocumentTextIcon;
      case 'photo':
        return DocumentTextIcon;
      case 'other':
      default:
        return DocumentTextIcon;
    }
  };

  const getTypeLabel = (type: Document['type']) => {
    const labels = {
      contract: 'Contrat',
      cv: 'CV',
      certificate: 'Certificat',
      id_copy: 'Pièce d\'identité',
      photo: 'Photo',
      other: 'Autre'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: Document['type']) => {
    const colors = {
      contract: 'bg-blue-100 text-blue-800',
      cv: 'bg-green-100 text-green-800',
      certificate: 'bg-purple-100 text-purple-800',
      id_copy: 'bg-yellow-100 text-yellow-800',
      photo: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getEmployeeName(doc.employeeId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const documentTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'contract', label: 'Contrats' },
    { value: 'cv', label: 'CVs' },
    { value: 'certificate', label: 'Certificats' },
    { value: 'id_copy', label: 'Pièces d\'identité' },
    { value: 'photo', label: 'Photos' },
    { value: 'other', label: 'Autres' }
  ];

  const totalDocuments = documents.length;
  const confidentialDocs = documents.filter(doc => doc.isConfidential).length;
  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestion des Documents" 
        description={`${filteredDocuments.length} document(s) trouvé(s) sur ${totalDocuments} au total`}
        icon={DocumentTextIcon}
      >
        <div className="flex items-center space-x-3">
          <ExportMenu 
            data={filteredDocuments.map(doc => ({
              'Nom': doc.name,
              'Type': getTypeLabel(doc.type),
              'Employé': getEmployeeName(doc.employeeId),
              'Taille': `${(doc.size / 1024).toFixed(1)} KB`,
              'Date Upload': format(doc.uploadDate, 'dd/MM/yyyy', { locale: fr }),
              'Confidentiel': doc.isConfidential ? 'Oui' : 'Non'
            }))}
            filename="documents_ena"
            title="Liste des Documents - ENA"
          />
          <button 
            onClick={() => setShowUploadZone(!showUploadZone)}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center"
          >
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            {showUploadZone ? 'Fermer Upload' : 'Télécharger'}
          </button>
        </div>
      </PageHeader>

      {/* Zone d'upload */}
      {showUploadZone && (
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Télécharger de nouveaux documents
          </h3>
          <FileDropZone 
            onUploadComplete={handleFilesUploaded}
            acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']}
            maxFiles={5}
            maxSize={10}
          />
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Documents
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalDocuments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Confidentiels
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {confidentialDocs}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Espace Utilisé
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatFileSize(totalSize)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ajoutés ce mois
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {documents.filter(doc => {
                      const docDate = new Date(doc.uploadDate);
                      const now = new Date();
                      return docDate.getMonth() === now.getMonth() && 
                             docDate.getFullYear() === now.getFullYear();
                    }).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-ena-blue-500 focus:border-ena-blue-500"
                    placeholder="Rechercher un document ou employé..."
                  />
                </div>
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-ena-blue-500 focus:border-ena-blue-500"
              >
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <FunnelIcon className="h-4 w-4 mr-2" />
                Plus de filtres
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="divide-y divide-gray-200">
          {filteredDocuments.map((document) => {
            const IconComponent = getDocumentIcon(document.type);
            return (
              <div key={document.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <IconComponent className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {document.name}
                        </p>
                        {document.isConfidential && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Confidentiel
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(document.type)}`}>
                          {getTypeLabel(document.type)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-sm text-gray-500">
                          {getEmployeeName(document.employeeId)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(document.size)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(document.uploadDate), 'dd/MM/yyyy', { locale: fr })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-600 rounded-full hover:bg-red-50">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Documents;
