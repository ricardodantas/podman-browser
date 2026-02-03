# podman-browser

Headless browser automation using Podman + Playwright for scraping JavaScript-rendered pages.

## What it does

This skill runs a headless Chromium browser inside a Podman container using Microsoft's official Playwright image. It's useful for:

- Scraping pages that require JavaScript to render content
- Fetching dynamically loaded data (SPAs, React apps, etc.)
- Automated browser tasks without installing browser dependencies locally

## Prerequisites

- **Podman 5.x+** installed and running
- No Docker required
- Internet connection (first run pulls ~1.5GB container image)

## Installation

### For OpenClaw users

Copy the skill folder to your OpenClaw skills directory:

```bash
cp -r podman-browser ~/.openclaw/workspace/skills/
```

Create a symlink to make it available in your PATH:

```bash
ln -sf ~/.openclaw/workspace/skills/podman-browser/podman-browse ~/.local/bin/podman-browse
```

### Standalone usage

Clone this repo and add to your PATH:

```bash
git clone https://github.com/ricardodantas/podman-browser.git
cd podman-browser
chmod +x podman-browse
ln -sf "$(pwd)/podman-browse" ~/.local/bin/podman-browse
```

## Usage

### Basic usage

```bash
# Get rendered text content from a page
podman-browse "https://example.com"
```

### Options

| Option | Description |
|--------|-------------|
| `--html` | Return raw HTML instead of text |
| `--wait <ms>` | Wait time after load (default: 2000ms) |
| `--selector <css>` | Wait for specific CSS selector before capturing |
| `-h, --help` | Show help |

### Examples

```bash
# Get rendered text content from Hacker News
podman-browse "https://news.ycombinator.com"

# Get raw HTML
podman-browse --html "https://news.ycombinator.com"

# Wait for specific element
podman-browse --selector ".itemlist" "https://news.ycombinator.com"

# Extra wait time for slow pages
podman-browse --wait 5000 "https://news.ycombinator.com/newest"
```

## How it works

1. Launches Microsoft's official Playwright container via Podman
2. Uses Chromium in headless mode with a realistic user agent
3. Navigates to the URL and waits for network idle
4. Optionally waits for a specific CSS selector
5. Applies additional wait time for JavaScript to settle
6. Returns text content (or HTML with `--html` flag)

## Files

| File | Description |
|------|-------------|
| `podman-browse` | Main bash script (entry point) |
| `browse.js` | Node.js Playwright script (mounted into container) |
| `SKILL.md` | OpenClaw skill documentation |

## Container Image

Uses `mcr.microsoft.com/playwright:v1.50.0-noble` with `playwright@1.50.0` npm package.

**Note**: The Playwright npm package version must match the container image version.

## Performance Notes

- First run pulls the container image (~1.5GB)
- Each run starts a fresh container (clean but takes ~10-15s)
- Uses `--ipc=host` for Chromium stability
- Uses `--init` to handle zombie processes

## License

MIT License - see [LICENSE](LICENSE) file.

## Contributing

Contributions welcome! Please open an issue or PR.

## Author

Ricardo Dantas ([@ricardodantas](https://github.com/ricardodantas))
