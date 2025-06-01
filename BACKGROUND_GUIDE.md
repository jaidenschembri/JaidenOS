# Desktop Background Guide

## How to Change Your Desktop Background

Your Desktop OS Theme now supports custom background images! Here are the different ways you can change your desktop background:

### 🖱️ Method 1: Right-Click Menu (Easiest)

1. **Right-click** anywhere on the desktop
2. Select **"Change Background"** from the context menu
3. Choose from the available background options:
   - **Clouds** - Peaceful sky scene
   - **Space** - Cosmic starfield
   - **Retro Grid** - Synthwave-style grid
   - **Mountains** - Nature landscape
   - **Default Pattern** - Original gradient pattern

### 🎨 Method 2: Theme-Based Backgrounds

Each theme has its own default background:

1. Click the **Start** button
2. Go to **Theme** submenu
3. Select a theme:
   - **Windows 95** - Cloud background
   - **Windows 98** - Space background  
   - **Windows 93** - Retro grid background

### 💻 Method 3: Custom Images (Advanced)

#### Adding Your Own Images:

1. **Add images** to the `static/backgrounds/` folder
2. **Edit** `src/lib/components/DesktopContextMenu.svelte`
3. **Add your image** to the `backgrounds` array:

```javascript
const backgrounds = [
  // ... existing backgrounds
  {
    name: 'My Custom Image',
    url: '/backgrounds/my-image.jpg'  // Your image path
  }
];
```

#### Direct CSS Method:

Edit `src/lib/styles/global.css` and modify the body styles:

```css
body {
  background-image: url('/backgrounds/your-image.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
```

#### Theme-Specific Backgrounds:

```css
body.desktop-theme {
  background-image: url('/backgrounds/windows95-bg.jpg');
}

body.win98-theme {
  background-image: url('/backgrounds/windows98-bg.jpg');
}

body.classic-theme {
  background-image: url('/backgrounds/retro-bg.jpg');
}
```

## 📝 Background Image Tips

### Recommended Specifications:
- **Resolution**: 1920x1080 or higher
- **Format**: JPG, PNG, or GIF
- **File size**: Under 2MB for best performance
- **Aspect ratio**: 16:9 for modern screens

### Best Practices:
- **Contrast**: Ensure desktop icons remain visible
- **Colors**: Avoid overly bright backgrounds that make text hard to read
- **Performance**: Compress images for faster loading
- **Accessibility**: Test readability with white text overlays

## 🔧 Troubleshooting

### Background Not Showing?
1. Check the image path is correct
2. Ensure the image file exists in `static/backgrounds/`
3. Try refreshing the page (F5)
4. Check browser console for errors

### Image Too Large/Small?
- Use `background-size: cover` for full coverage
- Use `background-size: contain` to fit entire image
- Use `background-size: 100% 100%` to stretch

### Want to Reset?
- Right-click desktop → Change Background → Default Pattern
- Or refresh the page to reload original settings

## 🎯 Quick Examples

### Solid Color Background:
```css
body {
  background-image: none;
  background-color: #2c3e50;
}
```

### Tiled Pattern:
```css
body {
  background-image: url('/backgrounds/pattern.png');
  background-size: 200px 200px;
  background-repeat: repeat;
}
```

### Gradient Background:
```css
body {
  background-image: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
}
```

---

**Enjoy customizing your desktop! 🎨** 