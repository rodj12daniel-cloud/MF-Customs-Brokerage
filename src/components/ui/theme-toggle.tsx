import { useState } from 'react';
import styled from 'styled-components';

const storageKey = 'mf-color-theme';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(
    () => document.documentElement.dataset.theme === 'light',
  );

  const handleChange = (checked: boolean) => {
    const theme = checked ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (themeColor) themeColor.content = checked ? '#fbfaf9' : '#0b0b0d';
    setIsLight(checked);

    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.warn('Unable to save the selected color theme.', error);
    }
  };

  return (
    <StyledWrapper>
      <input
        aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
        checked={isLight}
        className="theme-checkbox"
        onChange={(event) => handleChange(event.currentTarget.checked)}
        title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
        type="checkbox"
      />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;

  .theme-checkbox {
    --toggle-size: 10px;
    position: relative;
    width: 6.25em;
    height: 3.125em;
    margin: 0;
    appearance: none;
    border: 1px solid rgba(255, 255, 255, .2);
    border-radius: 99em;
    background: linear-gradient(to right, #2a2a2a 50%, #efefef 50%) no-repeat;
    background-size: 205%;
    background-position: 0;
    cursor: pointer;
    font-size: var(--toggle-size);
    transition: background-position .4s ease, border-color .4s ease;
  }

  .theme-checkbox::before {
    position: absolute;
    top: .25em;
    left: .25em;
    width: 2.25em;
    height: 2.25em;
    border-radius: 50%;
    background: linear-gradient(to right, #2a2a2a 50%, #efefef 50%) no-repeat;
    background-size: 205%;
    background-position: 100%;
    content: "";
    transition: left .4s ease, background-position .4s ease;
  }

  .theme-checkbox:checked {
    border-color: rgba(40, 40, 40, .24);
    background-position: 100%;
  }

  .theme-checkbox:checked::before {
    left: calc(100% - 2.25em - .25em);
    background-position: 0;
  }

  .theme-checkbox:focus-visible {
    outline: 2px solid #f5b7b7;
    outline-offset: 3px;
  }

  @media (max-width: 480px) {
    .theme-checkbox { --toggle-size: 9px; }
  }
`;
