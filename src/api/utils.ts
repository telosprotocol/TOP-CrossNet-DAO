const apiHost = process.env.NEXT_PUBLIC_API_HOST || '';
// const apiHost = "/api";

export async function get(url: string, config: any = {}) {
  const response = await fetch(apiHost + url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });
  const res = await response.json();
  if (res.success) {
    return res;
  }
  console.error(res);
  throw new Error(res.code);
}

export async function post(url: string, data: any = {}, config: any = {}) {
  const response = await fetch(apiHost + url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(data),
  });
  const res = await response.json();
  if (res.success) {
    return res;
  }
  console.error(res);
  throw new Error(res.code);
  // const res = await axios({
  //   method: 'post',
  //   url: apiHost + url,
  //   data: data,
  // });
}
