# Desktop Backgrounds

This folder contains background images for your Desktop OS Theme.

## Adding Custom Backgrounds

1. **Add your image files** to this folder (JPG, PNG, GIF supported)
2. **Recommended dimensions**: 1920x1080 or higher for best quality
3. **File naming**: Use descriptive names like `sunset.jpg`, `mountains.png`, etc.

## Using Custom Backgrounds

### Method 1: Right-click Desktop Menu
1. Right-click on the desktop
2. Select "Change Background" 
3. Choose from the available options

### Method 2: Direct CSS (Advanced)
You can also directly modify the CSS in `src/lib/styles/global.css`:

```css
body {
  background-image: url('/backgrounds/your-image.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

### Method 3: Theme-specific Backgrounds
Edit the theme classes in `global.css`:

```css
body.desktop-theme {
  background-image: url('/backgrounds/windows95-style.jpg');
}

body.win98-theme {
  background-image: url('/backgrounds/windows98-style.jpg');
}

body.classic-theme {
  background-image: url('/backgrounds/retro-style.jpg');
}
```

## Tips

- **Performance**: Optimize images for web (compress them)
- **Accessibility**: Ensure text remains readable over your background
- **Responsive**: Test backgrounds on different screen sizes
- **Fallback**: Always keep a background-color as fallback

## Default Backgrounds

The system comes with some default online backgrounds, but you can replace them with local files for better performance and offline usage. 