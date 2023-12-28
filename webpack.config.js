const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  
  // Force relative path to index.html for export images, css, js
  process.env.WEB_PUBLIC_URL="./";
  // if mode != production WEB_PUBLIC_URL will be replace by "/" which is annoying
  env.mode="production";
  env.pwa=false;

  const config = await createExpoWebpackConfigAsync(env, argv);
  // middleware config can be set here before return
  return config;
};
