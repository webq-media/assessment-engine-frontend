import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from '../../constants/axiosConfig';
import './assesment.css';
import { images } from '../../assets/images';
import { Avatar } from "flowbite-react";
import { Button,message } from 'antd';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AssignmentForm from './UploadAssignments';
import ViewReport from './ViewReport';
import Detailreport from './DetailReport';
import FailedReport from './FailedReport';

function Assesment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login if token is missing
      navigate('/login');
    }

    // Set the initial tab if activeTab is passed in the location state
    if (location.state && location.state.activeTab !== undefined) {
      setSelectedTabIndex(location.state.activeTab);
    }else {
      setSelectedTabIndex(0);
    }
    console.log("location",location);
    console.log("location",location.state);
  }, [location, navigate]);


  const handleLogout = async () => {
    try {
      // Make the API call to log the user out using GET method
      const token = localStorage.getItem('authToken');
      await axios.post('/user/logout_check/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Clear the token from local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('str_session_key');
      
      // Show success message
      message.success('Logged out successfully');
      
      // Redirect to the login page
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Show error message
      message.error('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      <div>
        <Tabs selectedIndex={selectedTabIndex} onSelect={index => setSelectedTabIndex(index)}>
          <header className='p-4 pt-[40px]'>
            <div className="container mx-auto flex justify-between items-center">
              {/* Logo on the left */}
              <div className="text-xl font-bold">
                <Link to='/'> <img src={images.Logo} alt="Logo" className="logo-img w-auto" /> </Link>
              </div>

              {/* tablist */}
              <div className='tab-top-section'>
                <TabList>
                  <Tab>Upload Assignments</Tab>
                  <Tab>View Report</Tab>
                  <Tab>View Detailed Report</Tab>
                  <Tab>View Failed Report</Tab>
                </TabList>
              </div>

              {/* Text and SVG on the right */}
              <div className="flex items-center space-x-4">
                <Avatar className='userheader' img={images.Avatar} rounded />
                <Button 
                  type="primary"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <div className="pt-[60px] container mx-auto tab-top-section">
            {/* React Tabs */}
            <TabPanel>
              <AssignmentForm />
            </TabPanel>

            <TabPanel>
              <ViewReport />
            </TabPanel>

            <TabPanel>
              <Detailreport />
            </TabPanel>

            <TabPanel>
              <FailedReport />
            </TabPanel>

          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default Assesment;
