const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {

  console.log(".............");
  console.log("CONFIG MIDDLEWARE....\n.............");
  console.log("NPM SCRIPT : " + JSON.stringify(process.env.npm_lifecycle_script));
  

  if(process.env.npm_lifecycle_script === "expo"){
    console.log("Config modding required for export");
    // Force relative path to index.html for export images, css, js
    process.env.WEB_PUBLIC_URL="./";
    // if mode != production WEB_PUBLIC_URL will be replace by "/" which is annoying
    env.mode="production";
    env.pwa=false;

    const config = await createExpoWebpackConfigAsync(env, argv);
    // middleware config can be set here before return
    // console.log(JSON.stringify(config));
    console.log(config.plugins);
    config.plugins.forEach(plugin => {
      if(typeof plugin.userOptions !== 'undefined' && plugin.userOptions.template !== null && plugin.userOptions.template !== ""){
        // that's probably the plugin we're lookin' for
        // let's change the default template by our modified one
        console.log("plugin found! let's force the template source...");
        // the customized template adds a reference to a env.js that will be added later
        // by a .sh script referenced in the dockerfile and will transmit system ENV to js.
        // This way, we can configure somme front-end js variables by system environnement variables controlled by Docker config. 
        plugin.userOptions.template="./src/index.html";
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
