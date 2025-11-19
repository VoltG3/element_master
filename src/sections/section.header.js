import styled from "styled-components"
import { SectionHeaderNavigationChapters } from "./section.header.navigation.chapters"
import SectionHeaderNavigationLanguages from "./section.header.navigation.languages"
import {SectionHeaderNavigationLogo} from "./section.header.navigation.logo";

const StyledSectionHeaderNavigation = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    border: solid 1px lightgrey;
    
    .innerHeader {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: auto;
        margin: 5px 20px;
        //border: solid 1px red;
        
        .innerHeaderLogo {
            display: flex;
            flex-direction: row;
            width: 220px;
            height: auto;
            //border: solid 1px green;
        }
        
        .innerHeaderChapters {
            display: flex;
            flex-direction: row;
            justify-content: center;
            width: 100%;
            height: auto;
            //border: solid 1px brown;
        }
        
        .innerHeaderLanguages {
            display: flex;
            flex-direction: row;
            width: auto;
            height: auto;
            //border: solid 1px red;
        }
    }
`

function SectionHeader() {

    return (
        <StyledSectionHeaderNavigation>
            <div className="innerHeader">
                <div className="innerHeaderLogo">
                    <SectionHeaderNavigationLogo />
                </div>

                <div className="innerHeaderChapters">
                    <SectionHeaderNavigationChapters />
                </div>

                <div className="innerHeaderLanguages">
                    <SectionHeaderNavigationLanguages />
                </div>
            </div>
        </StyledSectionHeaderNavigation>
    )
}

export default SectionHeader