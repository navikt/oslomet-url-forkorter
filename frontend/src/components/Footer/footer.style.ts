import styled from "styled-components";

export const FooterContainer = styled.footer`
  width: 100%;
    height:25vh;
  background-color: #003049;
  padding: 24px 40px;
    margin: 0;
  display: flex;
  align-items: flex-start;     
  justify-content: flex-start; 
`;

export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: -100px;
   
`;


export const FooterLogo = styled.img`
  height: 200px;
  object-fit: contain;
    margin-top:30px;
    transform: translateX(-108px);
    margin-bottom: -75px;

`;

export const FooterText = styled.p`
  font-size: 17px;
  font-weight: 530;
  color: white;
  margin: 0;
  padding-top: 0; 
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
`;



