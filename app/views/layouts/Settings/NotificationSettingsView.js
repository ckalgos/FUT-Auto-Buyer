import {
  idAbMessageNotificationToggle,
  idAbSoundToggle,
  idDiscordChannelId,
  idDiscordToken,
  idNotificationType,
  idTelegramBotToken,
  idTelegramChatId,
  idTestNotification,
} from "../../../elementIds.constants";
import { sendNotificationToUser } from "../../../utils/notificationUtil";
import { generateButton } from "../../../utils/uiUtils/generateButton";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";

export const notificationSettingsView = function () {
  return `<div style='display : none' class='buyer-settings-wrapper notification-settings-view'>  
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
  </div>
  `;
};
