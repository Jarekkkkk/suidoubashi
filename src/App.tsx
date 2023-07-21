import { useMemo } from 'react';
import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletKitProvider } from '@mysten/wallet-kit';

import { generateLinks } from '@/Constants';
import { Sidebar } from '@/Components';

function App() {
  const links = useMemo(() => generateLinks(), []);

  return (
    <WalletKitProvider>
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
    </WalletKitProvider>
  )
}

export default App
