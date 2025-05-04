import styled from "styled-components";

export const StyledHighscore = styled.div`
  width: 100%;
  padding: .3rem 0.3rem 0.7rem;
  text-align: center;
  font-family: Pixel, Arial, Helvetica, sans-serif;
  color: #ddd;
  background: #333333cf;
  border-radius: 1.25rem;

  .title {
    text-align: center;
    letter-spacing: 0.1rem;
  }
`

export const PlayerScore = styled.div`
  display: flex;
  justify-content: space-between;
  gap: .5rem;
  margin: .5rem .5rem 0 .5rem;
`