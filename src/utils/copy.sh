#!/bin/sh
cd /d/Project xiaocai/code-demo/blog-1/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log