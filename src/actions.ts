import alfy from 'alfy';

if (process.env.action === 'removeCache') {
  alfy.cache.set('files', undefined);
}
