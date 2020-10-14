#!/bin/bash

echo "running khaleesi shell to fix wx package."

mkdir dist/wx/assets

cp -R src/assets/tabbar dist/wx/assets/tabbar

cp sitemap.json dist/wx/