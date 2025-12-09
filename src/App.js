import React, { useEffect } from 'react';
import { Outlet, Link } from "react-router-dom"
import SectionHeader from "./sections/section.header";
import SectionFooter from "./sections/section.footer";
import SectionContent from "./sections/section.content";

// Import the registry getter from the centralized engine registry
// The import itself ensures that the registry code executes and data loads into memory.
import { getRegistry } from './engine/registry';

function App() {

  useEffect(() => {
    // Verify that registry data is loaded into memory
    const items = getRegistry();
    console.log("App start - Current Registry in Memory:", items);
  }, []);

  return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '100vh'
        }}>
            <SectionHeader />
                <SectionContent>
                    <Outlet />
                </SectionContent>
            <SectionFooter />
        </div>
      )
    }

export default App