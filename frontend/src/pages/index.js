import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Admin from './Admin';
import Client from './Client';


const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<Client />} />
      <Route path="/Admin" element={<Admin />} />
    </Routes>
  );
};

export default Pages;