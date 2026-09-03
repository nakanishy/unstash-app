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

type EventHandler<T> = (event: { payload: T }) => void;

const playbackListeners = new Set<EventHandler<PlaybackState>>();
let currentPlaybackState = initialPlaybackState;
let playbackTimer: ReturnType<typeof setInterval> | undefined;
const playbackSpeed = 7;

/** Browser-only replacement for the audio worker bridge used by the desktop app. */
export async function listen<T>(
  event: string,
  handler: EventHandler<T>,
): Promise<() => void> {
  if (event !== "player-state") {
    return () => {};
  }

  const playbackHandler = handler as EventHandler<PlaybackState>;
  playbackListeners.add(playbackHandler);
  handler({ payload: currentPlaybackState } as { payload: T });

  return () => {
    playbackListeners.delete(playbackHandler);
  };
}

function emitPlaybackState(nextState: PlaybackState) {
  currentPlaybackState = nextState;

  for (const handler of playbackListeners) {
    handler({ payload: nextState });
  }
}

function stopTimer() {
  if (playbackTimer !== undefined) {
    clearInterval(playbackTimer);
    playbackTimer = undefined;
  }
}

function durationForPath(path: string) {
  let hash = 0;

  for (const character of path) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return 2200 + (hash % 4600);
}

export function playSample(path: string) {
  stopTimer();

  const durationMs = durationForPath(path);
  emitPlaybackState({
    status: "playing",
    positionMs: 0,
    durationMs,
    path,
  });

  playbackTimer = setInterval(() => {
    const nextPosition = currentPlaybackState.positionMs + 25 * playbackSpeed;

    if (nextPosition >= durationMs) {
      stopTimer();
      emitPlaybackState({
        status: "stopped",
        positionMs: durationMs,
        durationMs,
        path,
      });
      return;
    }

    emitPlaybackState({
      ...currentPlaybackState,
      positionMs: nextPosition,
    });
  }, 25);
}

export function stopPlayback() {
  stopTimer();
  emitPlaybackState({
    status: "stopped",
    positionMs: 0,
    durationMs: currentPlaybackState.durationMs,
    path: currentPlaybackState.path,
  });
}

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
