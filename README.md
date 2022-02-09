<p align="center">
    <a href="https://commandbar.com" target="_blank" rel="noopener noreferrer">
      <img width="400" src="https://staticassets.commandbar.com/brand/netlify-plugin.png" alt="CommandBar + Netlify logo">
    </a>
</p>

<h2 align="center">CommandBar Netlify plugin</h2>

Quickly add CommandBar to your Netlify project.

- [What is CommandBar?](https://commandbar.com)
- [How do I add commands?](https://www.commandbar.com/docs/)

## Getting Started

[Sign up for a CommandBar account](https://app.commandbar.com/signup)

Create an [environment variable](https://docs.netlify.com/configure-builds/environment-variables/) `COMMANDBAR_ORG_ID` with your CommandBar organization id.

Configure the entry point (relative to the publish directory) if it's different from `index.html`.

```
# Example configuration

[[plugins]]
package = "@commandbar/netlify-plugin-commandbar"

# Optional
entryPoint = "path/to/entrypoint.html"

[plugins.inputs.linkCommands]
"Go to dashboard" = '/dashboard' // relative link
"Go to stack overflow" = 'https://stackoverflow.com' // aboslute link
```

## Troubleshooting

- Need help? Please reach out to [team@commandbar.com](team@commandbar.com)
- Found a bug in the plugin? Please open an [issue](https://github.com/tryfoobar/netlify-plugin-commandbar/issues) or a [pull request](https://github.com/tryfoobar/netlify-plugin-commandbar/pulls)
