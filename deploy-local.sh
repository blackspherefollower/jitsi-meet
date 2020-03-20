#!/bin/bash

set -x

mkdir netlify
mv libs netlify
mkdir netlify/css
mv css/all.css netlify/css
echo "/* https://alpha.jitsi.net/:splat 200" > netlify/_redirects
