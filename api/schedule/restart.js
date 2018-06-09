'use strict';
import cp from 'child_process';

export default async () => {
  try {
    await cp.exec('pm2 restart youshuangruomei');
    console.log('restart youshuangruomei');
  } catch (error) {
    console.log(error.message);
  }
};
