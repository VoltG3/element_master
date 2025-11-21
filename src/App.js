import React, { useEffect } from 'react';
import { Outlet, Link } from "react-router-dom"
import SectionHeader from "./sections/section.header";
import SectionFooter from "./sections/section.footer";
import SectionContent from "./sections/section.content";

// Mēs importējam getRegistry vai default exportu. 
// Pats imports jau garantē, ka kods GameRegistry.js izpildās un dati ielāsās atmiņā.
import { getRegistry } from './GameRegistry'; 

function App() {
  
  useEffect(() => {
    // Pārbaudām, vai dati ir atmiņā
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

    // Izdzēšam šo daļu, jo tagad izmantojam GameRegistry.js
    // const loadGameRegistry = () => { ... }
    // const gameRegistry = loadGameRegistry();
    // console.log("Game Registry Loaded:", gameRegistry);

    export default App