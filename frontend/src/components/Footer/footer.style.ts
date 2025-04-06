import styled from "styled-components";

export const FooterContainer = styled.footer`
  width: 100%;
  background-color: #003049;
  padding: 24px 40px;
  display: flex;
  align-items: flex-start;     
  justify-content: flex-start; 
`;

export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: -60px; 
`;


export const FooterLogo = styled.img`
  height: 200px;
  object-fit: contain;
  margin-bottom: -65px;
    transform: translateX(-100px);

`;

export const FooterText = styled.p`
  font-size: 1rem;
  font-weight: 400;
  color: white;
  margin: 0;
  padding-top: 0; 
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
`;



