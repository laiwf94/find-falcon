export const findFalcon = async (body) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(body),
    redirect: 'follow'
  };
  let result = {
    status: 'failed'
  };
  try {
    const res = await fetch(process.env.REACT_APP_FIND_URL, requestOptions)
    result = await res.json();
  } catch (ex) {
    // do nothing
  }
  return result;
};