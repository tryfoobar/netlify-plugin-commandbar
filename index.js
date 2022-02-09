const fs = require('fs').promises;
const { COMMANDBAR_ORG_ID } = process.env;

const getCommandBarSnippet = (orgId) => {
  return `<script>
    (function(){var o="${orgId}",n=["Object.assign","Symbol","Symbol.for"].join("%2C"),a=window;function r(o,n){void 0===n&&(n=!1),"complete"!==document.readyState&&window.addEventListener("load",r.bind(null,o,n),{capture:!1,once:!0});var a=document.createElement("script");a.type="text/javascript",a.async=n,a.src=o,document.head.appendChild(a)}function t(){var n;if(void 0===a.CommandBar){delete a.__CommandBarBootstrap__;var t=Symbol.for("CommandBar::configuration"),e=Symbol.for("CommandBar::orgConfig"),i=Symbol.for("CommandBar::disposed"),m=Symbol.for("CommandBar::isProxy"),l=Symbol.for("CommandBar::queue"),c=Symbol.for("CommandBar::unwrap"),d=[],s=localStorage.getItem("commandbar.lc"),u=s&&s.includes("local")?"http://localhost:8000":"https://api.commandbar.com",f=Object.assign(((n={})[t]={uuid:o},n[e]={},n[i]=!1,n[m]=!0,n[l]=new Array,n[c]=function(){return f},n),a.CommandBar),p=["addCommand","boot","getShortcuts"],y=f;Object.assign(f,{shareCallbacks:function(){return{}},shareContext:function(){return{}}}),a.CommandBar=new Proxy(f,{get:function(o,n){return n in y?f[n]:p.includes(n)?function(){var o=Array.prototype.slice.call(arguments);return new Promise((function(a,r){o.unshift(n,a,r),f[l].push(o)}))}:function(){var o=Array.prototype.slice.call(arguments);o.unshift(n),f[l].push(o)}}}),null!==s&&d.push("lc="+s),d.push("version=2"),r(u+"/latest/"+o+"?"+d.join("&"),!0)}}void 0===Object.assign||"undefined"==typeof Symbol||void 0===Symbol.for?(a.__CommandBarBootstrap__=t,r("https://polyfill.io/v3/polyfill.min.js?version=3.101.0&callback=__CommandBarBootstrap__&features="+n)):t();})();
    window.CommandBar.boot("commandbar-user");
  </script>`;
};

const readIndexHtml = async (path) => {
  return await fs.readFile(path, { encoding: 'utf8' });
};

const checkIfFileExists = async (path) => {
  return await fs.access(path);
};

const convertToSnakeCase = (str) => str.toLowerCase().split(' ').join('_');

const getLinkCommandSnippet = (name, link) => `
    window.CommandBar.addCommand({
      text: '${name}',
      name: '${convertToSnakeCase(name)}',
      template: {
        type: 'link',
        value: '${link}',
        operation: 'self'
      }
    });`;

const getLinkCommandsSnippet = (linkCommands) => {
  const linkCommandsCode = Object.entries(linkCommands)
    .filter(([key, value]) => key && value && key !== 'undefined')
    .map(([key, value]) => getLinkCommandSnippet(key, value));

  if (linkCommandsCode.length === 0) {
    return null;
  }

  const linkCommandsSnippet = linkCommandsCode.join('');

  return `<script>${linkCommandsSnippet}</script>`;
};

const injectCommandBarSnippet = async (entryPointPath, commandbarSnippet) => {
  const html = await readIndexHtml(entryPointPath);
  const htmlWithSnippet = html.replace('</head>', `${commandbarSnippet}</head>`);

  await fs.writeFile(entryPointPath, htmlWithSnippet);
};

const injectLinkCommandsSnippet = async (entryPointPath, linkCommandsSnippet) => {
  const html = await readIndexHtml(entryPointPath);
  const htmlWithSnippet = html.replace('</body>', `${linkCommandsSnippet}</body>`);

  await fs.writeFile(entryPointPath, htmlWithSnippet);
};

module.exports = {
  onPostBuild: async ({ netlifyConfig, inputs, utils }) => {
    if (!COMMANDBAR_ORG_ID) {
      utils.build.failBuild('Organization ID is not defined. CommandBar was not injected');
    }

    // Relative to publish directory
    const entryPointPath = inputs.entryPoint ?? "index.html";

    const fullEntryPointPath = `${netlifyConfig.build.publish}/${entryPointPath}`;
    const commandbarSnippet = getCommandBarSnippet(COMMANDBAR_ORG_ID);

    try {
      await checkIfFileExists(fullEntryPointPath);
    } catch (e) {
      console.error(e);
      utils.build.failBuild('Entry point file not found: ' + fullEntryPointPath);
    }

    try {
      await injectCommandBarSnippet(fullEntryPointPath, commandbarSnippet);

      utils.status.show({
        summary: 'CommandBar successfully injected',
      });
    } catch (e) {
      utils.status.show({
        summary: 'ERROR: CommandBar was not injected. Please double check that the entryPoint path was configured properly.',
      });
      throw(e);
    }

    if (inputs.linkCommands && inputs.linkCommands.length > 0) {
      try {
        const linkCommandsSnippet = getLinkCommandsSnippet(inputs.linkCommands);

        if (linkCommandsSnippet) {
          await injectLinkCommandsSnippet(fullEntryPointPath, linkCommandsSnippet);

          utils.status.show({
            summary: 'CommandBar link commands were successfully injected',
          });
        }
      } catch (e) {
        utils.status.show({
          summary: 'WARNING: CommandBar link commands were not injected',
        });
        throw(e);
      }
    }
  },
};
