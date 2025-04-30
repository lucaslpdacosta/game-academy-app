declare module "expo-av" {
  export class Sound {
    static createAsync(
      source: any,
      initialStatus?: any,
      onPlaybackStatusUpdate?: any,
      downloadFirst?: boolean
    ): Promise<{ sound: Sound }>;
    loadAsync(
      source: any,
      initialStatus?: any,
      downloadFirst?: boolean
    ): Promise<any>;
    playAsync(): Promise<any>;
    pauseAsync(): Promise<any>;
    stopAsync(): Promise<any>;
    unloadAsync(): Promise<void>;
    setOnPlaybackStatusUpdate(
      callback: (status: AVPlaybackStatus) => void
    ): void;
  }

  export interface AVPlaybackStatus {
    isLoaded: boolean;
    isPlaying?: boolean;
    error?: string;
    didJustFinish?: boolean;
  }

  export interface Asset {
    uri: string;
    name: string;
    type: string;
  }

  export const Audio: {
    setAudioModeAsync(options: {
      playsInSilentModeIOS?: boolean;
      staysActiveInBackground?: boolean;
      shouldDuckAndroid?: boolean;
    }): Promise<void>;
    Sound: typeof Sound;
  };
}
