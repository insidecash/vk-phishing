import type { Readable, Writable } from "stream";
import { serialize, deserialize } from "v8";

export function handle(
  stream: Readable,
  callback: (arg: unknown) => void
): void {
  let string = "";

  stream.on("data", buffer => {
    string += buffer.toString("utf8");

    const startIndex = string.indexOf("#");
    const endIndex = string.indexOf("@");

    if (startIndex >= 0 && endIndex >= 0) {
      const payload = string.slice(startIndex + 1, endIndex);

      const result = deserialize(Buffer.from(payload, "base64"));

      string = string.slice(0, startIndex) + string.slice(endIndex + 1);

      callback(result);
    }
  });
}

export function write(stream: Writable, data: unknown): void {
  stream.write("#" + serialize(data).toString("base64") + "@");
}
