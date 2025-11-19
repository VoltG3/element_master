import { Outlet, Link } from "react-router-dom"
import SectionHeader from "./sections/section.header";
import SectionFooter from "./sections/section.footer";
import SectionContent from "./sections/section.content";

function App() {

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