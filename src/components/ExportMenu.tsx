import React, { useState } from 'react';
import { 
  DocumentArrowDownIcon, 
  TableCellsIcon,
  PhotoIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ExportOption {
  type: 'pdf' | 'excel' | 'csv' | 'image';
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
}

interface ExportMenuProps {
  data?: any[];
  elementId?: string;
  filename?: string;
  title?: string;
  onExport?: (type: string) => void;
  className?: string;
}

export default function ExportMenu({ 
  data = [], 
  elementId, 
  filename = 'export', 
  title = 'Données ENA',
  onExport,
  className = '' 
}: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportOptions: ExportOption[] = [
    {
      type: 'pdf',
      label: 'PDF',
      icon: DocumentTextIcon,
      description: 'Document PDF imprimable'
    },
    {
      type: 'excel',
      label: 'Excel',
      icon: TableCellsIcon,
      description: 'Fichier Excel (.xlsx)'
    },
    {
      type: 'csv',
      label: 'CSV',
      icon: DocumentArrowDownIcon,
      description: 'Données CSV'
    },
    {
      type: 'image',
      label: 'Image',
      icon: PhotoIcon,
      description: 'Capture d\'écran PNG'
    }
  ];

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      
      if (elementId) {
        // Export d'un élément spécifique
        const element = document.getElementById(elementId);
        if (element) {
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true
          });
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 210;
          const pageHeight = 295;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          
          let position = 0;
          
          // Ajouter le titre
          pdf.setFontSize(16);
          pdf.text(title, 20, 20);
          position = 30;
          
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          
          pdf.save(`${filename}.pdf`);
        }
      } else if (data.length > 0) {
        // Export des données sous forme de tableau
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Titre
        pdf.setFontSize(16);
        pdf.text(title, 20, 20);
        
        // Tableau des données
        let yPosition = 40;
        const lineHeight = 10;
        const pageHeight = 280;
        
        if (data.length > 0) {
          const headers = Object.keys(data[0]);
          
          // Headers
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          headers.forEach((header, index) => {
            pdf.text(header, 20 + (index * 40), yPosition);
          });
          
          yPosition += lineHeight;
          
          // Données
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          
          data.forEach((row, rowIndex) => {
            if (yPosition > pageHeight) {
              pdf.addPage();
              yPosition = 20;
              
              // Répéter les headers
              pdf.setFont('helvetica', 'bold');
              pdf.setFontSize(12);
              headers.forEach((header, index) => {
                pdf.text(header, 20 + (index * 40), yPosition);
              });
              yPosition += lineHeight;
              pdf.setFont('helvetica', 'normal');
              pdf.setFontSize(10);
            }
            
            headers.forEach((header, index) => {
              const cellValue = String(row[header] || '');
              pdf.text(cellValue.substring(0, 15), 20 + (index * 40), yPosition);
            });
            
            yPosition += lineHeight;
          });
        }
        
        pdf.save(`${filename}.pdf`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = () => {
    try {
      setIsExporting(true);
      
      if (data.length === 0) return;
      
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // Ajouter le titre
      XLSX.utils.sheet_add_aoa(worksheet, [[title]], { origin: 'A1' });
      
      // Ajuster la largeur des colonnes
      const columnWidths = Object.keys(data[0]).map(key => ({
        wch: Math.max(key.length, 15)
      }));
      worksheet['!cols'] = columnWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      saveAs(blob, `${filename}.xlsx`);
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    try {
      setIsExporting(true);
      
      if (data.length === 0) return;
      
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const cellValue = String(row[header] || '');
            return cellValue.includes(',') ? `"${cellValue}"` : cellValue;
          }).join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${filename}.csv`);
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    try {
      setIsExporting(true);
      
      if (!elementId) return;
      
      const element = document.getElementById(elementId);
      if (element) {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
        
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, `${filename}.png`);
          }
        }, 'image/png');
      }
    } catch (error) {
      console.error('Erreur lors de l\'export image:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = async (type: ExportOption['type']) => {
    if (onExport) {
      onExport(type);
      return;
    }

    switch (type) {
      case 'pdf':
        await handleExportPDF();
        break;
      case 'excel':
        handleExportExcel();
        break;
      case 'csv':
        handleExportCSV();
        break;
      case 'image':
        await handleExportImage();
        break;
    }
    
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center space-x-2 px-4 py-2 bg-ena-blue-600 text-white rounded-lg hover:bg-ena-blue-700 transition-colors disabled:opacity-50"
      >
        <DocumentArrowDownIcon className="h-5 w-5" />
        <span>{isExporting ? 'Export en cours...' : 'Exporter'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2">
            <div className="text-sm font-medium text-gray-900 px-3 py-2 border-b border-gray-100">
              Choisir le format d'export
            </div>
            
            {exportOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.type}
                  onClick={() => handleExport(option.type)}
                  disabled={isExporting}
                  className="w-full flex items-start space-x-3 px-3 py-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <IconComponent className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Overlay pour fermer le menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
