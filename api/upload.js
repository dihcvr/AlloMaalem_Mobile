import RNFetchBlob from 'react-native-fetch-blob';
import * as React from 'react';
let upload = data => {
  return RNFetchBlob.fetch(
    'POST',
    'http://192.168.1.117:3000/upload',
    {
      Authorization: 'Bearer access-token',
      otherHeader: 'foo',
      'Content-Type': 'multipart/form-data',
      'Dropbox-API-Arg': JSON.stringify({
        path: '/img-from-react-native.png',
        mode: 'add',
        autorename: true,
        mute: false,
      }),
    },
    data,
  ).uploadProgress((written, total) => {
    console.log('uploaded', written / total);
  });
};

module.exports = upload;
