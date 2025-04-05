import styled from "styled-components";

export const HeaderContainer = styled.header`
    display: flex;
    height: 80px;
    align-items: center;
    justify-content:space-between;
    padding: 10px 20px;
    width: 100%;
    background: #f8f9fa;
`;

export const LogoText = styled.img`
    height: 300px;
    margin: 0;
    padding: 0;
    max-width: 100%;     /* Prevent it from stretching */
    object-fit: contain; /* Keeps aspect ratio */
    transform: translateX(-100px); /* Skyv 20px til venstre */

`;


export const DisplayUser = styled.p`
    margin: 0 15px;
`
export const StyledButton = styled.button`
  background: none;
  border: none;
  color: #00347d;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  padding: 12px 24px;
  border-radius: 12px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e6e9f2; /* Elegant, dus blågrå tone */
  }
`;



