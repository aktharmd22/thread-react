// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handlePdfChange = (e) => {
    setPdf(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);
    console.log(formData)

    try {
      const res = await axios.post('https://crmsnodebackend.smartyuppies.com/insertFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to upload files');
    }
  };

  return (
    <div>
      <h1>File Upload</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Image:</label>
          <input type="file" onChange={handleImageChange} accept="image/*" />
        </div>
        <div>
          <label>PDF:</label>
          <input type="file" onChange={handlePdfChange} accept="application/pdf" />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default App;
