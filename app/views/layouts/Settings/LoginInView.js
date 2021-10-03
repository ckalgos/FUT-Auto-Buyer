import { playLogoPng } from "../../../app.constants";
import {
  idAbUserExternalName,
  idAbUserExternalPassword,
} from "../../../elementIds.constants";

export const loginView = () => {
  return `<input type='text' id=${idAbUserExternalName} placeholder='Username' />
    <input type='password' id=${idAbUserExternalPassword} placeholder='Password' /><br/><br/>
    <h3>By logging in you can now fully control the autobuyer remotely</h3> <br/><br/>
    <label>You can create account by installing the Autobuyer Companion App here </label>
    <a style='display: flex; justify-content: center;' onClick="window.open('https://play.google.com/store/apps/details?id=com.fut.market.alert&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1', '_blank')" href='#'>
    <img width='200px' alt='Get it on Google Play' src='${playLogoPng}'/>
    </a>
    `;
};
