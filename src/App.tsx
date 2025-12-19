import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WritingSpace from './pages/WritingSpace';
import DraftSpace from './pages/DraftSpace';
import ContentAU from './pages/ContentAU';
import Hanajeon from './pages/Hanajeon';
import Pomery from './pages/Pomery';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WritingSpace />} />
        <Route path="/drafts" element={<DraftSpace />} />
        <Route path="/content-au" element={<ContentAU />} />
        <Route path="/hanajeon" element={<Hanajeon />} />
        <Route path="/pomery" element={<Pomery />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
