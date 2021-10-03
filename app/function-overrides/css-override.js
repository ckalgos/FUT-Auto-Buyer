export const cssOverride = () => {
  const style = document.createElement("style");
  style.innerText = `
  .buyer-header {
      font-size: 20px !important;
  }
  .buyer-settings {
      width: 100%;
  }
  .buyer-settings-field {
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .phone .buyer-settings-field{
    margin-top: auto;
    margin-bottom: auto;
    width: 100%;
    padding: 10px;
  }
  .buyer-settings-wrapper {
    display: flex; 
    flex-wrap: wrap; 
    margin-top: 20px;
  }
  .buyer-settings-field .ut-toggle-cell-view{
    justify-content: center;
  }
  .buyer-settings-field input:disabled {
    background-color: #c3c6ce;
    cursor: not-allowed;
  }
  .btn-test-notification
  {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  input[type="number"]{
    padding: 0 .5em;
    border-radius: 0;
    background-color: #262c38;
    border: 1px solid #4ee6eb;
    box-sizing: border-box;
    color: #4ee6eb;
    font-family: UltimateTeam,sans-serif;
    font-size: 1em;
    height: 2.8em;
    opacity: 1;
    width: 100%;
  }
  .autoBuyerLog {
    font-size: 15px; 
    width: 100%;
    height: 58%;
    background-color:#141414;
    color:#e2dde2;
  }
  .searchLog {
    font-size: 10px; 
    height: 37%;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }
  .captcha-settings-view input,
  .notification-settings-view input {
    text-transform: none;
  }
  .phone .buyer-header{
    font-size: 1.2em !important;
  }
  .phone .buyer-actions .btn-standard{
    padding: 0;
    font-size: 1.2em;
    text-overflow: unset;
  }
  .filter-header-settings {
    width: 100%;
    padding: 10px;
    font-family: UltimateTeamCondensed, sans-serif;
    font-size: 1.6em;
    color: #e2dde2;
    text-transform: uppercase;
    background-color: #171826;
  }
  .btn-save-filter {
    width:100%
  }
  .btn-delete-filter {
    width:50%
  }
  .multiple-filter {
    width: 100%  !important;
    display: flex  !important;
    justify-content: center;
    align-items: center;
  }
  .ut-pinned-list-container.ut-content-container {
    padding: 0 !important;
  }
  .auto-buyer .enhancer-option-header,
  .auto-buyer .enhancer-toggle {
    display: none !important;
  }
  .search-price-header{
    display: none !important;
  }
  .mrgTop10 {
    margin-top: 10px;
  }
  .header-hr {
    padding: 0px !important;
    width: 96% !important;
  }
  .stats-progress {
    float: right; 
    height: 10px; 
    width: 100px; 
    background: #888; 
    margin: 5px 0px 5px 5px;
  }
  .stats-fill {
    background: #000; 
    height: 10px; 
    width: 0%
  } 
  .filterSync {
    background: transparent;
    color: #c4f750
  }
  .filterSync:hover {
    background: transparent !important;
  }
  `;
  if (!isPhone()) {
    style.innerText += getScrollBarStyle();
  }
  document.head.appendChild(style);
};

const getScrollBarStyle = () => {
  return `
  ::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  ::-webkit-scrollbar:vertical {
      width: 12px;
  }
  ::-webkit-scrollbar:horizontal {
      height: 12px;
  }
  ::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, .5);
      border-radius: 10px;
      border: 2px solid #ffffff;
  }
  ::-webkit-scrollbar-track {
      border-radius: 10px;
      background-color: #ffffff;
  }`;
};
