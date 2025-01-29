import Search from "../components/Search/Search.tsx";
import Button from "../components/Button/Button";
import styled from "styled-components";

export default function LandingPage() {

    return (
        <Main>
            <Search placeholder="Kontroller din lenke.."/>
            <Button text="Logg inn" onClick={() => {console.log("Click")}}/>
        </Main>
    )
}
const Main = styled.main`
    min-height: 100vh;
    display: flex;
    gap: 1rem;
    flex-direction: column;
    place-items: center;
    place-content: center;
`