const mimeTypes = ["text/plain", "image/png", "image/gif", "image/jpeg"];

export default function validateFile(file) {
  if (!mimeTypes.includes(file.type)) return { error: "Invalid extension" };
  if (file.type === "text/plain" && file.size / 1024 > 100) {
    return { error: "File too large" };
  }
  return true;
}
