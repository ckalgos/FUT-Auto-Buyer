import {
  idAbMessageNotificationToggle,
  idAbSoundToggle,
  idCapatchaMp3,
  idDiscordChannelId,
  idDiscordToken,
  idNotificationType,
  idDetailedNotification,
  idTelegramBotToken,
  idTelegramChatId,
  idTestNotification,
  idWinMp3,
  idFinishMp3,
} from "../../../elementIds.constants";
import { sendNotificationToUser } from "../../../utils/notificationUtil";
import { generateButton } from "../../../utils/uiUtils/generateButton";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";

export const notificationSettingsView = function () {
  return `<div style='display : none' class='buyer-settings-wrapper notification-settings-view'>  
  <hr class="search-price-header header-hr">
  <div class="search-price-header">
    <h1 class="secondary">Notification Settings:</h1>
  </div>
  ${generateTextInput(
    "Telegram Bot Token",
    "",
    { idTelegramBotToken },
    "Token of your own bot",
    "text"
  )}
  ${generateTextInput(
    "Telegram Chat ID",
    "",
    { idTelegramChatId },
    "Your Telegram ChatID",
    "text"
  )}
  ${generateTextInput(
    "Discord Bot Token",
    "",
    { idDiscordToken },
    "Your Discord Bot Token",
    "text"
  )}
  ${generateTextInput(
    "Discord Channel ID",
    "",
    { idDiscordChannelId },
    "Your Discord Channel ID",
    "text"
  )}
  ${generateTextInput(
    "Notification Type",
    "",
    { idNotificationType },
    "Type A for all notifications, B for buy or L for lost",
    "text"
  )}
  ${generateToggleInput(
    "Detailed Notifications",
    { idDetailedNotification },
    "Log-Messages as notification and Autobuyer Stopped messages with reasons"
  )}
  <div class="price-filter buyer-settings-field">
  </div>
  ${generateToggleInput(
    "Send Notification",
    { idAbMessageNotificationToggle },
    ""
  )}
  ${generateToggleInput("Sound Notification", { idAbSoundToggle }, "")}
  <div class="btn-test-notification buyer-settings-field">
  ${generateButton(
    idTestNotification,
    "Test Notification",
    () => sendNotificationToUser("Test Notification Message", true),
    "call-to-action"
  )}
  <audio id='${idWinMp3}' hidden>
    <source src="https://notificationsounds.com/storage/sounds/file-sounds-869-coins.ogg" type="audio/ogg">
    <source src="https://notificationsounds.com/storage/sounds/file-sounds-869-coins.mp3" type="audio/mpeg">
      "Your browser does not support the audio element"
  </audio> 
  <audio id='${idCapatchaMp3}' hidden>
    <source src="https://notificationsounds.com/storage/sounds/file-sounds-897-alarm-frenzy.ogg" type="audio/ogg">
    <source src="https://notificationsounds.com/storage/sounds/file-sounds-897-alarm-frenzy.mp3" type="audio/mpeg">
      "Your browser does not support the audio element"
  </audio>
  <audio id='${idFinishMp3}' hidden>
    <source src="https://freesound.org/data/previews/220/220763_4104696-lq.ogg" type="audio/ogg">
    <source src="https://freesound.org/data/previews/220/220763_4104696-lq.mp3" type="audio/mpeg">
      "Your browser does not support the audio element"
  </audio>
  </div>
  `;
};
