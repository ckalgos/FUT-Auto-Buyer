import {
  idAbServerLogin,
  idAbUserExternalName,
  idAbUserExternalPassword,
} from "../elementIds.constants";
import { loginView } from "../views/layouts/Settings/LoginInView";
import { sendUINotification } from "./notificationUtil";
import { showPopUp } from "./popupUtil";
import { Auth } from "../external/aws-amplify";
import { hideLoader, showLoader } from "./commonUtil";
import { initializeDiscord } from "../services/discordService";

export const handleSignInSignOut = async () => {
  const isLoggedIn = $(`#${idAbServerLogin}`).text() === "Logout";
  if (isLoggedIn) {
    await Auth.signOut();
    $(`#${idAbServerLogin}`).html("Login to AB Server");
    return;
  }
  showPopUp(
    [
      { labelEnum: enums.UIDialogOptions.OK },
      { labelEnum: enums.UIDialogOptions.CANCEL },
    ],
    "Login",
    loginView(),
    async (text) => {
      text === 2 && (await loginHandler());
    }
  );
};

const loginHandler = async () => {
  const userName = $(`#${idAbUserExternalName}`).val();
  const password = $(`#${idAbUserExternalPassword}`).val();

  if (!userName || !password) {
    sendUINotification(
      "Username or password missing !!!",
      UINotificationType.NEGATIVE
    );
    return;
  }

  showLoader();
  sendUINotification("Please wait trying to login");

  try {
    const authResponse = await Auth.signIn(userName, password);
    sendUINotification(`Welcome back ${authResponse.username} !!!`);
    $(`#${idAbServerLogin}`).html("Logout");
    await initDiscord();
  } catch (err) {
    sendUINotification(
      err.message || "Error occured when trying to login",
      UINotificationType.NEGATIVE
    );
  }
  hideLoader();
};

export const getUserAccessToken = async (initialize) => {
  try {
    const session = await Auth.currentSession();
    const token = session.getAccessToken().getJwtToken();
    if (initialize) {
      await initDiscord();
    }
    return token;
  } catch (err) {
    return null;
  }
};

const initDiscord = async () => {
  const { attributes } = await Auth.currentAuthenticatedUser({
    bypassCache: true,
  });
  if (attributes) {
    const userDiscordToken = attributes["custom:discord_token"];
    const userDiscordChannelId = attributes["custom:dicord_channelId"];
    userDiscordToken &&
      initializeDiscord(userDiscordToken, userDiscordChannelId);
  }
};
