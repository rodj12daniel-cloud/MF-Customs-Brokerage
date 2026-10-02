import styled from 'styled-components';
import brandLogo from '../../../assets/mflogo-display.png';

const Loader = () => (
  <StyledWrapper>
    <div className="loader-wrapper" role="status" aria-label="Loading MF Customs Brokerage">
      <span className="loader-glow" aria-hidden="true" />
      <img className="loader-logo" src={brandLogo} alt="" />
    </div>
  </StyledWrapper>
);

const StyledWrapper = styled.div`
  .loader-wrapper {
    position: relative;
    display: grid;
    width: 220px;
    height: 150px;
    place-items: center;
  }

  .loader-glow {
    position: absolute;
    width: 140px;
    height: 90px;
    border-radius: 50%;
    background: rgba(244, 241, 235, .08);
    filter: blur(28px);
    animation: logo-glow 1.8s ease-in-out infinite;
  }

  .loader-logo {
    position: relative;
    display: block;
    width: 150px;
    height: 100px;
    object-fit: contain;
    filter: brightness(0) invert(1) drop-shadow(0 0 8px rgba(244, 241, 235, .5));
    animation: logo-breathe 1.8s ease-in-out infinite;
  }

  @keyframes logo-glow {
    0%, 100% { opacity: .45; transform: scale(.82); }
    50% { opacity: 1; transform: scale(1.12); }
  }

  @keyframes logo-breathe {
    0%, 100% { filter: brightness(0) invert(1) drop-shadow(0 0 6px rgba(244, 241, 235, .35)); }
    50% { filter: brightness(0) invert(1) drop-shadow(0 0 18px rgba(244, 241, 235, .9)); }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-glow,
    .loader-logo {
      animation: none;
    }
  }
`;

export default Loader;
