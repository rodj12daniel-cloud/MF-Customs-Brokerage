import styled from 'styled-components';

const loadingText = 'Loading';

const Loader = () => (
  <StyledWrapper>
    <div className="loader-wrapper" role="status" aria-label="Loading customs photos">
      <span className="loader-label" aria-hidden="true">
        {Array.from(loadingText, (letter, index) => (
          <span className="loader-letter" key={`${letter}-${index}`} style={{ animationDelay: `${index * 0.1}s` }}>
            {letter}
          </span>
        ))}
      </span>
      <div className="loader" aria-hidden="true" />
    </div>
  </StyledWrapper>
);

const StyledWrapper = styled.div`
  .loader-wrapper {
    position: relative;
    display: flex;
    width: 180px;
    height: 180px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: transparent;
    color: rgba(245, 245, 243, .92);
    font-family: "Inter", sans-serif;
    font-size: 1.2em;
    font-weight: 300;
    user-select: none;
  }

  .loader-label {
    position: relative;
    z-index: 1;
    white-space: nowrap;
  }

  .loader {
    position: absolute;
    z-index: 0;
    inset: 0;
    aspect-ratio: 1;
    border-radius: 50%;
    background: transparent;
    box-shadow: 0 10px 20px 0 #f4f1eb inset, 0 20px 30px 0 #7da5ba inset, 0 60px 60px 0 #294655 inset;
  }

  .loader-letter {
    display: inline-block;
    opacity: 1;
  }
`;

export default Loader;