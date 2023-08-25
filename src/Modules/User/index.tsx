
export const USER_TOKEN_STORAGE_NAME = 'userToken';

const setUserToken = (token: string) => {
  localStorage.setItem(USER_TOKEN_STORAGE_NAME, token);
};

const getUserToken = () => localStorage.getItem(USER_TOKEN_STORAGE_NAME);

const removeUserToken = () => localStorage.removeItem(USER_TOKEN_STORAGE_NAME);

const UserModule = {
  setUserToken,
  getUserToken,
  removeUserToken,
};

export default UserModule;