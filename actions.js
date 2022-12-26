import alfy from 'alfy';

if (process.env.action === 'removeCache') {
  alfy.cache.clear();
  process.exit(0);
}
