import { useState } from 'react';
import { uploadImage } from '../api/admin';

const ImageUpload = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url); 
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = ''; 
    }
  };

  return (
    <div className="image-upload">
      {value && <img src={value} alt="Preview" className="image-upload-preview" />}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ImageUpload;