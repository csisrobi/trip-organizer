export default function formDataFetcher(url: string, data: any) {
  return fetch(`http://localhost:3000/api${url}`, {
    method: 'POST',
    credentials: 'include',
    body: data,
  }).then((res) => {
    if (res.status > 399 && res.status < 200) {
      throw new Error();
    }
    return res.json();
  });
}
