const apiConfig = {
  // baseUrl: 'http://10.0.2.2:8080', // local
  baseUrl: 'http://trustheal.in:8080', // server
  zegoCloudAppId: 558378046,
  zegoCloudAppSign: '6a7186f7d654688499212a30b7b3b8202cf8b90b7bbbcb71889f3bdc5eb382bc',
  AgoraAppId: 'a52ffd2fd11145278aac47b9e38c3e42',
};

export default apiConfig;

export async function fileUpload(formData) {
  return fetch(`${apiConfig.baseUrl}/file/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((response) =>
      // console.log(':::::::::Log 1::::', response);

      response.json()
    )
    .then((response) =>
      // console.log(':::::::Log 2::::', response);
      ({ error: null, response })
    )
    .catch((error) => ({ error: error.response }));
}
