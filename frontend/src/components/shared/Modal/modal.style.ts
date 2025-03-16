import styled from "styled-components";

export const Backdrop = styled.div`
    position: fixed;
    background: rgba(51, 51, 51, 0.94);
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 998;
`;

export const ModalContainer = styled.div`
    position: fixed;
    width: 80vw;
    max-width: fit-content;
    height: fit-content;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fffffe;
    border: 5px solid $kj-blaa-4;
    border-radius: 5px;
    font-size: 12px;
    z-index: 999;
`