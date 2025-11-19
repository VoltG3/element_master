import styled from "styled-components"

const StyledSectionContent = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    border: solid 1px lightgray;
`

function SectionContent({ children }) {

    return (
        <StyledSectionContent>
            { children }
        </StyledSectionContent>
    )
}

export default SectionContent