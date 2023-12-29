const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  
  // Force relative path to index.html for export images, css, js
  process.env.WEB_PUBLIC_URL="./";
  // if mode != production WEB_PUBLIC_URL will be replace by "/" which is annoying
  env.mode="production";
  env.pwa=false;

  const config = await createExpoWebpackConfigAsync(env, argv);
  // middleware config can be set here before return
  // console.log(JSON.stringify(config));

  config.plugins.forEach(plugin => {
    if(plugin.userOptions !== undefined && plugin.options !== undefined){
      // that's probably the plugin we're lookin' for
      // let's change the default template by our modified one
      console.log("plugin found! let's force the template source...");
      // the customized template adds a reference to a env.js that will be added later
      // by a .sh script referenced in the dockerfile and will transmit system ENV to js.
      // This way, we can configure somme front-end js variables by system environnement variables controlled by Docker config. 
      plugin.userOptions.template="./src/index.html";
      plugin.options.template="./src/index.html";
    }
  });

  return config;
};
