import styled from "styled-components";

export const StyledHighscoreModal = styled.div`
  width: 100%;
  padding: 1.1rem 0.3rem;
  text-align: center;
  font-family: Pixel, Arial, Helvetica, sans-serif;
  color: #ddd;
  background: #333333cf;
  border-radius: 1.25rem;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h2 {
    margin-top: 0;
    color: white;
    margin-bottom: 0.5rem;
  }

  input {
    font-family: Pixel;
    line-height: 1.3em;
    padding: 0.3rem 0.3rem 0.3rem 0.3rem;
  }

  button {
    padding: 0.6rem 0.6rem;
    font-family: Pixel;
    margin-top: 0.5rem;
  }
`;
