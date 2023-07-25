import { useMemo } from 'react';
import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletKitProvider } from '@mysten/wallet-kit';

import { generateLinks } from '@/Constants';
import { Page } from '@/Components';

function App() {
  const links = useMemo(() => generateLinks(), []);

  return (
    <WalletKitProvider>
      <BrowserRouter>
        <Page>
          <Routes>
            {
              links.map((link) => {
                return <Route {...link} />;
              })
            }
          </Routes>
        </Page>
      </BrowserRouter>
    </WalletKitProvider>
  )
}

export default App
