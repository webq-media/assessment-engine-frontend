import React, { useState, useEffect } from 'react';
import { Upload, Button, message, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from '../../constants/axiosConfig';
import { useLocation, useNavigate } from 'react-router-dom';

import './DirectUpload.css';

function DirectUpload() {
    const location = useLocation();
  const navigate = useNavigate();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }

    if (location.state && location.state.activeTab !== undefined) {
      setSelectedTabIndex(location.state.activeTab);
    }else {
      setSelectedTabIndex(0);
    }
    console.log("location",location);
    console.log("location",location.state);
  }, [location, navigate]);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("Please select at least one file to upload.");
      return;
    }

    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files', file.originFileObj);
    });

    for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
    setUploading(true);
    try {
      const response = await axios.post('/assessment_app/file_upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadResult(response.data);
      setShowModal(true);
      message.success("Files uploaded successfully!");
    } catch (error) {
      message.error("Failed to upload files.");
      console.error(error);
    } finally {
      setUploading(false);
      setFileList([]);
    }
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList);

  return (
    <div className='upload-container-main'>
    <div className="upload-container">
      <h2>Upload Files</h2>
      <Upload
        onChange={handleFileChange}
        fileList={fileList}
        multiple
        beforeUpload={() => false} 
      >
        <Button icon={<UploadOutlined />}>Select Files</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        className="upload-button"
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>

      <Modal
        title="Upload Summary"
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowModal(false)}>
            Close
          </Button>,
        ]}
      >
        {uploadResult ? (
          <div>
            <p>Total Files: {uploadResult.total_files}</p>
            <p>Successful Uploads: {uploadResult.successful}</p>
            <p>Failed Uploads: {uploadResult.failed}</p>
          </div>
        ) : (
          <p>No upload summary available.</p>
        )}
      </Modal>
    </div>
    </div>
  );
}

export default DirectUpload;
