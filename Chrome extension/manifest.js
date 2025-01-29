{
  "manifest_version": 3,
  "name": "Video & PDF Embedder",
  "version": "1.0",
  "description": "Embed YouTube videos and Google Drive PDFs with an adjustable overlay.",
  "permissions": ["activeTab", "scripting"],
  "background": {
    "service_worker": "background.js"
  },
  "host_permissions": ["*://*/*"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icon.png",
      "48": "icon.png",
      "128": "icon.png"
    }
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]
}
