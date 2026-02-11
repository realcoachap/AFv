#!/bin/bash

# MakeHuman Auto-Installer for Linux
# Run this script when you get back to your computer
# chmod +x install_makehuman.sh && ./install_makehuman.sh

echo "🚀 Installing MakeHuman on Linux..."
echo "=================================="

# Detect distro
if [ -f /etc/debian_version ]; then
    DISTRO="debian"
elif [ -f /etc/arch-release ]; then
    DISTRO="arch"
elif [ -f /etc/fedora-release ]; then
    DISTRO="fedora"
else
    DISTRO="unknown"
fi

echo "📦 Detected distro: $DISTRO"

# Install dependencies
echo "📥 Installing dependencies..."
if [ "$DISTRO" = "debian" ] || [ "$DISTRO" = "ubuntu" ]; then
    sudo apt update
    sudo apt install -y python3 python3-pip python3-opengl \
        python3-pyqt5 python3-pyqt5.qtopengl python3-pyqt5.qtsvg \
        python3-numpy git
elif [ "$DISTRO" = "arch" ]; then
    sudo pacman -S --needed python python-pip python-numpy \
        python-pyqt5 python-opengl git
elif [ "$DISTRO" = "fedora" ]; then
    sudo dnf install -y python3 python3-pip python3-numpy \
        python3-qt5 python3-opengl git
else
    echo "⚠️  Unknown distro, trying pip install..."
    pip3 install numpy PyQt5 PyOpenGL
fi

# Clone MakeHuman
echo "📂 Cloning MakeHuman repository..."
if [ -d "$HOME/makehuman" ]; then
    echo "⚠️  MakeHuman directory exists, updating..."
    cd "$HOME/makehuman"
    git pull
else
    cd "$HOME"
    git clone https://github.com/makehumancommunity/makehuman.git
    cd makehuman/makehuman
fi

# Download assets
echo "🎨 Downloading assets (this may take a few minutes)..."
python3 download_assets_git.py

# Create desktop entry
echo "🖥️  Creating desktop shortcut..."
cat > "$HOME/.local/share/applications/makehuman.desktop" << EOF
[Desktop Entry]
Name=MakeHuman
Comment=3D Character Creator
Exec=python3 $HOME/makehuman/makehuman/makehuman.py
Icon=$HOME/makehuman/makehuman/icons/makehuman.icns
Type=Application
Categories=Graphics;3DGraphics;
Terminal=false
EOF

# Create launcher script
echo "🚀 Creating launcher script..."
cat > "$HOME/makehuman-launcher.sh" << 'EOF'
#!/bin/bash
cd "$HOME/makehuman/makehuman"
python3 makehuman.py "$@"
EOF
chmod +x "$HOME/makehuman-launcher.sh"

echo ""
echo "✅ MakeHuman installation complete!"
echo "=================================="
echo ""
echo "🎮 To run MakeHuman:"
echo "   Option 1: python3 $HOME/makehuman/makehuman/makehuman.py"
echo "   Option 2: $HOME/makehuman-launcher.sh"
echo "   Option 3: Look for 'MakeHuman' in your applications menu"
echo ""
echo "📖 Quick Start Guide:"
echo "   1. Launch MakeHuman"
echo "   2. Use sliders on the right to adjust body"
echo "   3. Click 'Geometry' tab for body shape"
echo "   4. Click 'Materials' for skin/clothing"
echo "   5. Export → File → Export → .mhx2 or .fbx"
echo ""
echo "💪 For Fitness Characters:"
echo "   - Muscle: 0.8 (high)"
echo "   - Weight: 0.5 (athletic)"
echo "   - Age: 25 (prime)"
echo ""
echo "🚀 Ready to create your first character!"
