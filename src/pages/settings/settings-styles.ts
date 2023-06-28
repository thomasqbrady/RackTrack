import { css } from 'lit';

// these styles can be imported from any component
// for an example of how to use this, check /pages/about-about.ts
export const styles = css`
  sl-card {
    position: relative;
    width: 100%;
    margin-bottom: 32px;
  }

  h2 {
    width: 100%;
    text-align: center;
  }

  textarea {
    width: 100%;
    height: 20em;
  }

  sl-icon {
    position: absolute;
    top: 22px;
    right: 22px;
  }

  .data-tool-icon {
    font-size: 24px;
  }

  main {
    margin: 0 18px;
  }
`;