# Installation

[⬅️ Back to README.md](../README.md)

1. First **install [node js and npm](https://nodejs.org/en/download/)** if not installed yet. I recommend latest LST version - 12 at the time

2. Go to [Releases Page](https://github.com/xxhax-team/vk-phishing/releases) and **download the [Latest Release](https://github.com/xxhax-team/vk-phishing/releases/latest)** for your platform:   
`vk-phishing-win.zip` - For Windows  
`vk-phishing-unix.zip` - For Linux & macOS

3. **Unzip** the file into a folder & **open it** in file explorer

4. **Run** file `install.sh` or `install.bat` depending on your system.  

## Startup

**To start phishing run** file `start.sh` of `start.bat` depending on your system. After a successful start you will see a `terminal` / `cmd` with contents that looks like this:   
  
![Server: http://localhost:3000, NGrock: CONNECTED etc...](./successful-startup.png)

## Configuration

Edit file `config.yml`, then restart phishing. Please do not mess up with formatting, because yaml is sensitive to it. **All options are commented**

## UnInstallation

Delete the folder, containing phishing, file `config.yml` and folder `node_modules`. That's all

[⬅️ Back to README.md](../README.md)
