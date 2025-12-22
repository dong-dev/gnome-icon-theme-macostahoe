# Develop
## Requirement
- nodejs version 24 or later: for generate theme script
- magick: to resize png files
## Add image
- png  
.png files should place to `original/apps`  
.png files should have at least 512px by 512px  
If you add or modify .png file, you have to run `./generate-images.js` once  
You should have to add new key to imageNameMap dictionary for png file name which value is an array of string which is Icon value from .desktop files (often in /usr/share/applications directory) 
- svg  
.svg files should place to `scalable/apps`
(WIP)
## Generate Theme
```bash  
npm start
```
New theme should generated into themes/ folder
## Installing icon theme
```bash  
npm start
sudo cp -r ./macOSTahoe /usr/share/icons/
```
## Set icon theme as active
```bash  
gsettings set org.gnome.desktop.interface icon-theme 'Adwaita'
gsettings set org.gnome.desktop.interface icon-theme 'macOSTahoe'
```