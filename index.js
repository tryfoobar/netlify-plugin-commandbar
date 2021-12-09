const fs = require("fs").promises;

const getCommandBarSnippet = (orgId) => {
  return `<script>
    (function(){var o="${orgId}",a=["Object.assign","Symbol","Symbol.for"].join("%2C"),n=window;function r(o,a){void 0===a&&(a=!1),"complete"!==document.readyState&&window.addEventListener("load",r.bind(null,o,a),{capture:!1,once:!0});var n=document.createElement("script");n.type="text/javascript",n.async=a,n.src=o,document.head.appendChild(n)}function t(){var a;if(void 0===n.CommandBar){delete n.__CommandBarBootstrap__;var t=Symbol.for("CommandBar::configuration"),e=Symbol.for("CommandBar::orgConfig"),m=Symbol.for("CommandBar::disposed"),i=Symbol.for("CommandBar::isProxy"),l=Symbol.for("CommandBar::queue"),d=Symbol.for("CommandBar::unwrap"),c=[],s=localStorage.getItem("commandbar.lc"),u=s&&s.includes("local")?"http://localhost:8000":"https://api.commandbar.com",p=Object.assign(((a={})[t]={uuid:o},a[e]={},a[m]=!1,a[i]=!0,a[l]=new Array,a[d]=function(){return p},a),n.CommandBar);n.CommandBar=new Proxy(p,{get:function(o,a){return a in p?p[a]:function(){var o=Array.prototype.slice.call(arguments);o.unshift(a),p[l].push(o)}}}),null!==s&&c.push("lc="+s),c.push("version=2"),r(u+"/latest/"+o+"?"+c.join("&"),!0)}}void 0===Object.assign||"undefined"==typeof Symbol||void 0===Symbol.for?(n.__CommandBarBootstrap__=t,r("https://polyfill.io/v3/polyfill.min.js?version=3.101.0&callback=__CommandBarBootstrap__&features="+a)):t();})();
    window.CommandBar.boot("commandbar-user");
  </script>`;
};

const readIndexHtml = async (path) => {
  return await fs.readFile(path, { encoding: "utf8" });
};

const convertToSnakeCase = (str) => str.toLowerCase().split(" ").join("_");

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
    .filter(([key, value]) => key && value && key !== "undefined")
    .map(([key, value]) => getLinkCommandSnippet(key, value));

  if (linkCommandsCode.length === 0) {
    return null;
  }

  const linkCommandsSnippet = linkCommandsCode.join("");

  return `<script>${linkCommandsSnippet}</script>`;
};

const injectCommandBarSnippet = async (indexHtmlPath, commandbarSnippet) => {
  const html = await readIndexHtml(indexHtmlPath);
  const htmlWithSnippet = html.replace(
    "</head>",
    `${commandbarSnippet}</head>`
  );

  await fs.writeFile(indexHtmlPath, htmlWithSnippet);
};

const injectLinkCommandsSnippet = async (
  indexHtmlPath,
  linkCommandsSnippet
) => {
  const html = await readIndexHtml(indexHtmlPath);
  const htmlWithSnippet = html.replace(
    "</body>",
    `${linkCommandsSnippet}</body>`
  );

  await fs.writeFile(indexHtmlPath, htmlWithSnippet);
};

module.exports = {
  onPostBuild: async ({ netlifyConfig, inputs, utils }) => {
    const indexHtmlPath = `${netlifyConfig.build.publish}/index.html`;
    const commandbarSnippet = getCommandBarSnippet(inputs.orgId);

    try {
      await injectCommandBarSnippet(indexHtmlPath, commandbarSnippet);

      console.log("CommandBar snippet was successfully injected");
    } catch (e) {
      console.error(e);
      utils.build.failBuild("CommandBar snippet was not injected");
    }

    if (inputs.linkCommands) {
      try {
        const linkCommandsSnippet = getLinkCommandsSnippet(inputs.linkCommands);

        if (linkCommandsSnippet) {
          await injectLinkCommandsSnippet(indexHtmlPath, linkCommandsSnippet);

          console.log(
            "CommandBar link commands snippet was successfully injected"
          );
        }
      } catch (e) {
        console.error(e);
        console.log("CommandBar link commands snippet was not injected");
      }
    }
  },
};
