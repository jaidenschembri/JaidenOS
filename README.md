# Desktop OS Theme

A customizable desktop operating system theme project built with SvelteKit. This project creates a modern, user-friendly interface with customizable themes and components that mimics a desktop environment in the browser.

<!-- Trigger deployment -->

## 🚀 Features

- **Custom theme support** - Switch between different OS themes
- **User interface customization** - Personalize your desktop environment
- **Desktop environment modifications** - Interactive windows, taskbar, and start menu
- **Theme switching capabilities** - Dynamic theme changes
- **Modern UI components** - Responsive and interactive elements

## 🛠️ Technologies

- **SvelteKit** - Full-stack web framework
- **TypeScript** - Type-safe JavaScript
- **CSS/SCSS** - Styling and animations
- **Vite** - Build tool and development server

## 📁 Project Structure

```
├── src/
│   ├── lib/
│   │   └── components/     # Reusable UI components
│   ├── routes/            # SvelteKit routes
│   └── app.html          # Main HTML template
├── static/               # Static assets
│   └── icons/           # Icon files
├── themes/              # Theme definitions and assets
└── build/               # Production build output (GitHub Pages)
```

## 🌐 GitHub Pages Deployment

This project is configured for GitHub Pages deployment with automated workflows.

### Automatic Deployment

1. **Push to main branch** - The GitHub Actions workflow will automatically build and deploy
2. **Manual deployment** - Use the "Actions" tab to manually trigger deployment

### Manual Deployment

```bash
# Build for GitHub Pages
npm run build:gh-pages

# Deploy to GitHub Pages (using gh-pages package)
npm run deploy
```

### GitHub Pages Setup

1. Go to your repository **Settings** → **Pages**
2. Set **Source** to "GitHub Actions"
3. The workflow will automatically deploy on push to main branch

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

The project uses `@sveltejs/adapter-static` for static site generation, configured in `svelte.config.js`:

- **Base path**: `/jaiden-os` (for GitHub Pages)
- **Prerendering**: Enabled for all pages
- **Error handling**: Graceful handling of missing assets

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:gh-pages` - Build for GitHub Pages with production environment
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to GitHub Pages
- `npm run check` - Run Svelte type checking
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🎨 Themes

The project supports multiple themes:
- **Windows 93** - Classic retro theme
- **Windows 98** - Nostalgic 90s theme

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌟 Live Demo

Visit the live demo: [https://jaidenschembri.github.io/jaiden-os](https://jaidenschembri.github.io/jaiden-os)

---

Built with ❤️ using SvelteKit 