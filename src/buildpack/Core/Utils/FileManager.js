import { appDir } from "@tauri-apps/api/path";
import {
  writeFile,
  createDir,
  readTextFile,
  writeBinaryFile,
  removeFile,
  readBinaryFile,
} from "@tauri-apps/api/fs";

export default class FileManager {
  constructor() {}
  async retrieveBinaryExact(filedir) {
    return await readBinaryFile(`${filedir}`).catch((err) => {
      console.warn(err);
      return null;
    });
  }
  async retrieveFileExact(filedir) {
    return await readTextFile(`${filedir}`).catch((err) => {
      console.warn(err);
      return null;
    });
  }
  async retrieveFile(file, dir, binary) {
    if (!dir) {
      let dd = await appDir();
      if (binary) {
        let file2 = await readBinaryFile(`${dd}${file}`).catch((err) => {
          console.warn(err);
          return null;
        });
        return file2;
      } else {
        let file1 = await readTextFile(`${dd}${file}`).catch((err) => {
          console.warn(err);
          return null;
        });
        return file1;
      }
    } else {
      if (binary) {
        let file2 = await readBinaryFile(`${dir}${file}`).catch((err) => {
          console.warn(err);
          return null;
        });
      } else {
        readTextFile(`${dir}/${file}`)
          .then((data) => {
            return data;
          })
          .catch((err) => {
            console.warn(err);
            return null;
          });
      }
    }
  }
  async makeDir(dir, inpath) {
    try {
      if ((!dir && inpath == false) || inpath == null) {
        return appDir()
          .then(async (path) => {
            console.log(path);
            return await createDir(path);
          })
          .catch((e) => {
            return null;
          });
      }
      switch (inpath) {
        case true: {
          return appDir().then(async (path) => {
            return await createDir(`${path}/${dir}`);
          });
          break;
        }
        case false: {
          return await createDir(dir);
          break;
        }
      }
    } catch {
      return null;
    }
  }
  async createFile(data, file, dir, binary) {
    if (!dir) {
      return appDir().then(async (d) => {
        if ((await this.retrieveFile(`${d}/${file}`)) == null) removeFile(`${d}/${file}`);
        console.log(`${d}/${file}`);
        switch (binary) {
          case true: {
            return writeBinaryFile({
              path: `${d}/${file}`,
              contents: data,
            });
          }
          case false: {
            return writeFile({
              path: `${d}/${file}`,
              contents: data,
            });
            break;
          }
        }
      });
    } else if (dir) {
      if ((await this.retrieveFile(`${dir}/${file}`)) == null) removeFile(`${dir}/${file}`);
      switch (binary) {
        case true: {
          return writeBinaryFile({
            path: `${dir}/${file}`,
            contents: data,
          });
          break;
        }
        case false: {
          return writeFile({
            path: `${dir}/${file}`,
            contents: data,
          });
          break;
        }
      }
    }
  }
}
