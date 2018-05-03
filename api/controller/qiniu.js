import qiniu from 'qiniu';
import nconf from 'nconf';

const getUploadToken = async ctx => {
  qiniu.conf.ACCESS_KEY = nconf.get('qiniu').ACCESS_KEY;
  qiniu.conf.SECRET_KEY = nconf.get('qiniu').SECRET_KEY;

  const mac = new qiniu.auth.digest.Mac(
    nconf.get('qiniu').ACCESS_KEY, nconf.get('qiniu').ACCESS_KEY
  );

  const options = {
    scope: nconf.get('qiniu').Bucket,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"name":"$(x:name)"}'
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  ctx.body = {
    code: 200,
    uploadToken,
    domain: nconf.get('qiniu').Domain
  };
};

export {
  getUploadToken
};
