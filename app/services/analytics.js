import { getValue, setValue } from "./repository";
const sendRequest = (url, payload, token = null) => {
  return fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? "Bearer " + token : null,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
};

const getToken = () => {
  let authToken = getValue("authToken");
  if (!authToken) {
    authToken = localStorage.getItem("abAuthToken");
    if (authToken) {
      const payload = atob(authToken.split(".")[1]);
      const expiration = new Date(payload.exp);
      if (expiration.getTime() > new Date().getTime()) {
        return { token: authToken };
      }
    }
  }
  return authToken;
};

const generateToken = () => {
  const email = getValue("useremail");
  const { id: userId } = services.User.getUser();
  return sendRequest(
    atob(
      "aHR0cHM6Ly9scHA5dThlY2VmLmV4ZWN1dGUtYXBpLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tL2Rldi90b2tlbg=="
    ),
    { email, userId }
  );
};

export const trackMarketPrices = async (playerPrices) => {
  let authToken = getToken();
  if (!authToken) {
    let token = await (await generateToken()).json();
    localStorage.setItem("abAuthToken", token);
    authToken = {
      token,
      expiryTimeStamp: new Date(Date.now() + 55 * 60 * 1000),
    };
    setValue("authToken", authToken);
  }
  return sendRequest(
    atob(
      "aHR0cHM6Ly8yNWllNXRoMnE0LmV4ZWN1dGUtYXBpLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tL2Rldi9hdWN0aW9u"
    ),
    { playerPrices },
    authToken.token
  );
};
