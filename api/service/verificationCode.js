'use strict';
import QcloudSms from 'qcloudsms_js';
import nconf from 'nconf';

const sendCode = (phoneNumbers, code) => {
  const appid = nconf.get('telent').appid;
  const appkey = nconf.get('telent').appkey;
  const templId = nconf.get('telent').templId;
  const smsSign = nconf.get('telent').smsSign;
  const qcloudsms = QcloudSms(appid, appkey);
  const ssender = qcloudsms.SmsSingleSender();
  const params = [code, '15'];
  return new Promise((resolve, reject) => {
    ssender.sendWithParam(86, phoneNumbers[0], templId,
      params, smsSign, '', '', (err, res, resData) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
  });
};

export {
  sendCode
};
