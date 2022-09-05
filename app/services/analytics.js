import { getValue, setValue } from "./repository";
const sendRequest = (url, payload, token = null) => {
  return fetch(url, {
    headers: {
      Accept: "'application/json'",
      "Content-Type": "'application/json'",
      Authorization: token ? "Bearer " + token : null,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
};

const generateToken = () => {
  const email = getValue("useremail");
  const { id: userId } = services.User.getUser();
  return sendRequest(
    atob(
      "aHR0cHM6Ly8zcHFtaHc3NmE0LmV4ZWN1dGUtYXBpLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tL2Rldi90b2tlbg=="
    ),
    { email, userId }
  );
};

export const trackMarketPrices = async (playerPrices) => {
  return sendRequest(
    atob(
      "aHR0cHM6Ly9oZmZnZHpiZGxsLmV4ZWN1dGUtYXBpLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tL2Rldi9hdWN0aW9u"
    ),
    { playerPrices }
  );
};
