// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-commonjs */
module.exports = {
  extends: ['@modern-js-app'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'eslint-comments/no-unused-disable': 'off',
  },
};
