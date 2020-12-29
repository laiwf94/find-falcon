export const getToken = async () => {
  const requestOptions = {
    method: 'POST',
    body: '',
    redirect: 'follow'
  };
  let token = { token: ''};
  try {
    const res = await fetch(process.env.REACT_APP_TOKEN_URL, requestOptions)
    token = await res.json();
  } catch (ex) {
    // do nothing
  }
  return token;
}