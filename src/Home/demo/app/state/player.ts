import { useEffect, useState } from "react";

export type PlaybackStatus = "playing" | "paused" | "stopped";

export interface PlaybackState {
  status: PlaybackStatus;
  positionMs: number;
  durationMs: number | null;
  path: string | null;
}

const initialPlaybackState: PlaybackState = {
  status: "stopped",
  positionMs: 0,
  durationMs: null,
  path: null,
};

/** Subscribes to state updates emitted by the Tauri audio worker bridge. */
export function usePlaybackState() {
  const [playbackState, setPlaybackState] =
    useState<PlaybackState>(initialPlaybackState);

  useEffect(() => {
    let active = true;
    let unlisten: (() => void) | undefined;

    listen<PlaybackState>("player-state", ({ payload }) => {
      setPlaybackState(payload);
    })
      .then((cleanup) => {
        if (active) {
          unlisten = cleanup;
        } else {
          cleanup();
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to subscribe to player state:", error);
      });

    return () => {
      active = false;
      unlisten?.();
    };
  }, []);

  return playbackState;
}
