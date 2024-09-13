const { app, BrowserWindow } = require("electron");
const { exec } = require("child_process");
const path = require("path");
let mainWindow;

function createWindow() {
  // Tạo cửa sổ Electron
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Mở giao diện Node-RED trong Electron
  mainWindow.loadURL("http://127.0.0.1:1881/ui");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

function startNodeRed() {
  const nodeBinary = path.join(__dirname, "node-binary", "node");
  const userDir = path.join(__dirname, "node-red-data");
  const nodeRedDir = path.join(__dirname, "/node_modules/node-red/red.js");
  const command = `${nodeBinary} ${nodeRedDir} -p 1881 -u ${userDir}`;
  console.log(command);
  // Khởi động Node-RED
  const nodeRedProcess = exec(command);

  // Kiểm tra PID sau khi khởi động
  if (nodeRedProcess.pid) {
    console.log(nodeRedProcess.pid);
    setTimeout(() => {
      mainWindow.loadURL("http://127.0.0.1:1881/ui");
    }, 3000);
  } else {
    console.error(
      "Failed to retrieve PID. Node-RED may not have started successfully."
    );
  }
}

app.whenReady().then(() => {
  createWindow();
  startNodeRed();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
