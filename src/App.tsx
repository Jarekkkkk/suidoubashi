import { useMemo } from 'react';
import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { generateLinks } from '@/Constants';
import { Sidebar } from '@/Components';

function App() {
  const links = useMemo(() => generateLinks(), []);

  console.log(links)

  return (
    <BrowserRouter>
      <Sidebar isOpen={false} />
      <Routes>
        {
          links.map((link) => {
            return <Route {...link} />;
          })
        }
      </Routes>
    </BrowserRouter>
  )
}

export default App
