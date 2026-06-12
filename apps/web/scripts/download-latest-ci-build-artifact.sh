#!/bin/bash
set -e

# 使用环境变量 GH_TOKEN
curl_response=$(curl -L -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GH_TOKEN" \
  "https://api.github.com/repos/innei/cyber/actions/artifacts?per_page=5&page=1")
download_url=$(echo $curl_response | jq -r '.artifacts[] | select(.name == "artifact") | .archive_download_url')

if [ -z "$download_url" ] || [ "$download_url" == "null" ]; then
  echo "没有找到 URL 或发生了错误。"
  exit 1
else
  echo "找到的 URL: $download_url"
  # 此处可以添加用于下载文件的命令，例如：
  # curl -L "$download_url" -o desired_filename.zip
fi

# 使用环境变量 GH_TOKEN
curl -L -H "Authorization: Bearer $GH_TOKEN" "$download_url" -o build.zip

[ ! -d "cyber" ] && mkdir cyber
unzip build.zip
unzip -o release.zip 'standalone/*' -d cyber
