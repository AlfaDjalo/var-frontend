import React, { useState, useRef, useEffect } from 'react';
import './FileSelect.css';  // You can rename this file if you want

export const FileSelect = ({ uploadedFileName, handleFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(uploadedFileName || null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (uploadedFileName) {
      setSelectedFile(uploadedFileName);
    } 
  }, [uploadedFileName]);

  // Validate the selected file
  const validateFile = (file) => {
    if (!file) {
      return "Please select a file";
    }

    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
      return "Please select a CSV file";
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return "File size must be less than 10MB";
    }

    return null;
  };

  const onFileChange = (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      setSelectedFile(null);
      handleFileSelect(null);
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);
    handleFileSelect(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onFileChange(file);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    handleFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="data-upload">
      <h2>Load Data</h2>

      <p>Select a CSV file containing time series returns for your portfolio</p>

      <div className="file-select">
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {!selectedFile ? (
          <div
            className="upload-area"
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: 'pointer', padding: 20, border: '2px dashed #ccc', borderRadius: 8, textAlign: 'center' }}
          >
            <p>Click or drag to select a CSV file</p>
          </div>
        ) : (
          <div className="file-selected" style={{ position: 'relative', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
            <p>{selectedFile.name}</p>
            <button 
              onClick={handleClear} 
              style={{ position: 'absolute', top: 8, right: 8, cursor: 'pointer' }}
              aria-label="Clear selected file"
            >
             ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileSelect;