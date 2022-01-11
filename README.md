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

[Sign up for a CommandBar account](https://commandbar.com/signup)

Add your CommandBar ID to your netlify.toml

```
# Example configuration

[[plugins]]
package = "netlify-plugin-commandbar"

# Required
[plugins.inputs]
orgID = 424242

# Optional
[plugins.inputs.linkCommands]
"Go to google" = 'https://google.com'
"Go to stack overflow" = 'https://stackoverflow.com'
```

## Troubleshooting

- Need help? Please reach out to [team@commandbar.com](team@commandbar.com)
- Found a bug in the plugin? Please open an [issue](https://github.com/tryfoobar/netlify-plugin-commandbar/issues) or a [pull request](https://github.com/tryfoobar/netlify-plugin-commandbar/pulls)
