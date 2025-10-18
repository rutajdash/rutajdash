export default function processAudio(
  audioContext: AudioContext,
  base64PcmData: string,
  sampleRate = 16000,
  numberOfChannels = 1,
): AudioBuffer {
  // Decode the Base64 string into a binary ArrayBuffer
  const binaryString = atob(base64PcmData);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Create an AudioBuffer
  // For 16-bit PCM, each sample is 2 bytes.
  const frameCount = bytes.length / 2 / numberOfChannels;
  const audioBuffer = audioContext.createBuffer(
    numberOfChannels,
    frameCount,
    sampleRate,
  );

  // Create an Int16Array view of the decoded data
  // This allows us to read the 16-bit signed integer samples directly.
  const pcmData = new Int16Array(bytes.buffer);

  // Populate the AudioBuffer with the PCM data
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // The data is interleaved, so we pick out samples for this channel.
      const sample = pcmData[i * numberOfChannels + channel];
      // Normalize the 16-bit signed integer to a 32-bit float between -1.0 and 1.0.
      channelData[i] = sample / 32768.0;
    }
  }

  return audioBuffer;
}
