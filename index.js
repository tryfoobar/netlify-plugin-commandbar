const fs = require("fs").promises;

const getSnippet = (orgId) => {
  return `<script>(function(){var o="${orgId}",a=["Object.assign","Symbol","Symbol.for"].join("%2C"),n=window;function r(o,a){void 0===a&&(a=!1),"complete"!==document.readyState&&window.addEventListener("load",r.bind(null,o,a),{capture:!1,once:!0});var n=document.createElement("script");n.type="text/javascript",n.async=a,n.src=o,document.head.appendChild(n)}function t(){var a;if(void 0===n.CommandBar){delete n.__CommandBarBootstrap__;var t=Symbol.for("CommandBar::configuration"),e=Symbol.for("CommandBar::orgConfig"),m=Symbol.for("CommandBar::disposed"),i=Symbol.for("CommandBar::isProxy"),l=Symbol.for("CommandBar::queue"),d=Symbol.for("CommandBar::unwrap"),c=[],s=localStorage.getItem("commandbar.lc"),u=s&&s.includes("local")?"http://localhost:8000":"https://api.commandbar.com",p=Object.assign(((a={})[t]={uuid:o},a[e]={},a[m]=!1,a[i]=!0,a[l]=new Array,a[d]=function(){return p},a),n.CommandBar);n.CommandBar=new Proxy(p,{get:function(o,a){return a in p?p[a]:function(){var o=Array.prototype.slice.call(arguments);o.unshift(a),p[l].push(o)}}}),null!==s&&c.push("lc="+s),c.push("version=2"),r(u+"/latest/"+o+"?"+c.join("&"),!0)}}void 0===Object.assign||"undefined"==typeof Symbol||void 0===Symbol.for?(n.__CommandBarBootstrap__=t,r("https://polyfill.io/v3/polyfill.min.js?version=3.101.0&callback=__CommandBarBootstrap__&features="+a)):t();})();</script>`;
}

const readIndexHtml = async (path) => {
  return await fs.readFile(path, {encoding: "utf8"});
}

module.exports = {
  onPostBuild: async ({ netlifyConfig, inputs, utils }) => {
    const snippet = getSnippet(inputs.orgId);
    const indexHtmlPath = `${netlifyConfig.build.publish}/index.html`;

    try {
      const html = await readIndexHtml(indexHtmlPath);
      const htmlWithSnippet = html.replace("</head>", `${snippet}</head>`);

      await fs.writeFile(indexHtmlPath, htmlWithSnippet);
      console.log('CommandBar snippet was successfully injected');
    } catch(e) {
      console.error(e)
      utils.build.failBuild("CommandBar snippet was not injected");
    }
  },
};


