import styled from "styled-components"

const StyledSectionHeaderFooter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    height: auto;
    border: solid 1px lightgray;

    .innerFooter {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        width: 100%;
        height: auto;
        margin: 5px 20px;
        //border: solid 1px red;
    }

    p {
        font-size: 12px;
        color: lightgrey;
    }
`

function SectionFooter() {

    return (
        <StyledSectionHeaderFooter>
            <div className="innerFooter">
                <p>element_masters v.0.0.0</p>
            </div>
        </StyledSectionHeaderFooter>
    )
}

export default SectionFooter