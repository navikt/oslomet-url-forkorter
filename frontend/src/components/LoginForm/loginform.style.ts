import styled from "styled-components";

export const LoginContainer = styled.form`
    width: 80vw;
    max-width: 350px;
    padding: 30px;
    background: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: .5rem;

    h2 {
        color: var(--theme-color);
        margin-bottom: 15px;
        font-size: 22px;
    }
`;

export const LoginInput = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
`;

export const LoginButton = styled.button`
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: none;
    border-radius: 5px;
    background: var(--theme-color);
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: var(--theme-color-focus);
    }
`;
