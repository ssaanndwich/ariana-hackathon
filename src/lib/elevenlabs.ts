const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'IKne3meq5aSn9XLyUdCD'; // Default voice ID (Armin)

let audioQueue: { url: string; onEnd?: () => void }[] = [];
let isPlaying = false;

export async function speakWithElevenLabs(text: string, onEnd?: () => void): Promise<void> {
  try {
    // Validate API key
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key is not configured');
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Add to queue with callback
    audioQueue.push({ url: audioUrl, onEnd });
    
    // If not already playing, start playing
    if (!isPlaying) {
      playNextAudio();
    }
  } catch (error) {
    console.error('Error with ElevenLabs voice synthesis:', error);
    throw error;
  }
}

async function playNextAudio() {
  if (audioQueue.length === 0) {
    isPlaying = false;
    return;
  }

  isPlaying = true;
  const { url, onEnd } = audioQueue.shift()!;
  const audio = new Audio(url);

  try {
    await audio.play();
  } catch (error) {
    if (error instanceof Error && error.name === 'NotAllowedError') {
      // If autoplay is blocked, wait for user interaction
      console.log('Audio playback blocked. Waiting for user interaction...');
      audioQueue.unshift({ url, onEnd }); // Put the audio back in the queue
      isPlaying = false;
      return;
    }
    throw error;
  }

  // Clean up and play next audio when current one ends
  audio.onended = () => {
    URL.revokeObjectURL(url);
    onEnd?.();
    playNextAudio();
  };
}

// Export a function to manually trigger audio playback
export function playAudioQueue() {
  if (!isPlaying && audioQueue.length > 0) {
    playNextAudio();
  }
} 
