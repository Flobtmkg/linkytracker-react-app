const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {

  console.log(".............");
  console.log("CONFIG MIDDLEWARE....\n.............");
  console.log("NPM SCRIPT : " + JSON.stringify(process.env.npm_lifecycle_script));

  if(process.env.BABEL_ENV === "production"){
    console.log("Config modding required for production export");
    // Force relative path to index.html for export images, css, js
    process.env.WEB_PUBLIC_URL="./";
    // if mode != production WEB_PUBLIC_URL will be replace by "/" which is annoying
    env.mode="production";
    env.pwa=false;

    const config = await createExpoWebpackConfigAsync(env, argv);
    // middleware config can be set here before return
    // console.log(JSON.stringify(config));

    config.plugins.forEach(plugin => {
      // HtmlWebpackPlugin
      if(plugin.constructor.name === "HtmlWebpackPlugin"){
        // let's change the default template by our modified one
        console.log("plugin found! let's force the template source...");
        plugin.userOptions.template="./src/index.html";
        if(typeof plugin.options !== 'undefined'){
          plugin.options.template = "./src/index.html";
        };
      }
    });
    console.log(".............\n");
    return config;
  }

  else {
    console.log("Default config, no config modding required");
    console.log(".............\n");
    return await createExpoWebpackConfigAsync(env, argv);
  }

};
