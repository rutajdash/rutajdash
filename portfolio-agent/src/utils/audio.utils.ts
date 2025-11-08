export function getPCM16FromBase64(base64: string): Int16Array {
  const buffer = Buffer.from(base64, "base64");
  const pcm16 = new Int16Array(
    buffer.buffer,
    buffer.byteOffset,
    buffer.length / Int16Array.BYTES_PER_ELEMENT,
  );
  return pcm16;
}

export function combinePCM16Chunks(chunks: Int16Array[]): Int16Array {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const combined = new Int16Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }
  return combined;
}
