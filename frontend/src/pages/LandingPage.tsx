import Search from "../components/Search/Search";
import Button from "../components/Button/Button";
import styled from "styled-components";

export default function LandingPage() {


    return (
        <Main>
            <Search placeholder="Kontroller din lenke.."/>
            <Button>Logg inn</Button>
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
