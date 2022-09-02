import { appStoreLogoPng, playLogoPng } from "../../../app.constants";
import {
  idAbUserExternalName,
  idAbUserExternalPassword,
} from "../../../elementIds.constants";

export const loginView = () => {
  return `<input type='text' id=${idAbUserExternalName} placeholder='Username' />
    <input type='password' id=${idAbUserExternalPassword} placeholder='Password' /><br/><br/> 
    <label>You can create account by installing the Autobuyer Companion App here </label>
    <div style='display: flex;justify-content: space-around;margin: 10px;'>
      <a style='display: flex; justify-content: center;' onClick="window.open(atob('aHR0cHM6Ly9wbGF5Lmdvb2dsZS5jb20vc3RvcmUvYXBwcy9kZXRhaWxzP2lkPWNvbS5mdXQubWFya2V0LmFsZXJ0'), '_blank')" href='#'>
        <img width='200px' alt='Get it on Play Store' src='${playLogoPng}'/>
      </a>
      <a style='display: flex; justify-content: center;' onClick="window.open(atob('aHR0cHM6Ly9hcHBzLmFwcGxlLmNvbS91cy9hcHAvZnV0LW1hcmtldC1hbGVydC9pZDE1OTA1MDUxNzk='), '_blank')" href='#'>
        <img width='200px' alt='Get it on App Store' src='${appStoreLogoPng}'/>
      </a>
    </div>
    `;
};
