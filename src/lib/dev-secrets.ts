/**
 * Dev secrets — for humans who read source and open DevTools.
 *
 * Console: `__julia.help()`
 * Konami code: unlocks Byte Verse mode (tilt your imagination).
 * Type anywhere: auway · hairy · julia
 *
 * ps — "Samantha" in DEFAULT_SITE_CONFIG is a template ghost. Not Julia's cat.
 */

export const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
] as const;

const SECRET_PHRASES: Record<string, () => void> = {
  auway: () => logSecret("Auway", "Strava for pets. Custom collar. Apple Watch. Academy flagship."),
  hairy: () => logSecret("Hairy", "Plants + sensors + Watch. TCC grew up."),
  julia: () => logSecret("Julia", "Yes, the grid is named after me. No, you cannot rename --grid-unit."),
  byteverse: () => logSecret("Byte Verse", "Tilt your phone. Shoot aliens. Regret nothing."),
};

export type JuliaConsole = {
  version: string;
  gridUnit: number;
  help: () => void;
  auway: () => void;
  hairy: () => void;
  byteVerse: () => void;
  cat: () => void;
  grid: () => void;
  sam: () => void;
};

declare global {
  interface Window {
    __julia?: JuliaConsole;
  }
}

function logSecret(title: string, message: string) {
  console.log(
    `%c ${title} %c ${message}`,
    "background: var(--primary, #2563eb); color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: 700;",
    "color: inherit;"
  );
}

function printWelcome() {
  const styles = [
    "font-size: 14px; font-weight: 700;",
    "font-size: 11px; color: #6b7280;",
    "font-size: 11px; color: #9ca3af; font-style: italic;",
  ];

  console.log(
    "%c👋 hey, source reader\n%cThis portfolio runs on Julia Grid (8px tokens, zero Tailwind on public UI).\n%cType `__julia.help()` — or try the Konami code. Telepathy support: still in beta.",
    ...styles
  );
}

function triggerByteVerseMode() {
  logSecret(
    "Byte Verse",
    "🕹️ Space Invaders mode. Tilt your device to move. (This website stays still. Physics is hard.)"
  );

  const previousTitle = document.title;
  document.title = "🕹️ Byte Verse — tilt to scroll (not really)";
  document.documentElement.classList.add("byte-verse-mode");

  window.setTimeout(() => {
    document.title = previousTitle;
    document.documentElement.classList.remove("byte-verse-mode");
  }, 4000);
}

export function createJuliaConsole(): JuliaConsole {
  return {
    version: "0.1.0-julia-grid",
    gridUnit: 8,
    help: () => {
      console.table({
        "__julia.auway()": "Academy flagship — pet activity app",
        "__julia.hairy()": "Plants, hardware, Apple Watch",
        "__julia.byteVerse()": "Accelerometer gaming lore",
        "__julia.cat()": "Important research",
        "__julia.grid()": "Why everything is ×8",
        "__julia.sam()": "Who is Samantha?",
        Konami: "↑↑↓↓←→←→BA",
        "type anywhere": "auway · hairy · julia · byteverse",
      });
    },
    auway: SECRET_PHRASES.auway,
    hairy: SECRET_PHRASES.hairy,
    byteVerse: () => {
      SECRET_PHRASES.byteverse();
      triggerByteVerseMode();
    },
    cat: () =>
      logSecret(
        "Cat",
        "Devoted cat person. The footer cat is spiritual, not literal. Yet."
      ),
    grid: () =>
      logSecret(
        "Julia Grid",
        "--grid-unit: 8px. --space-* = multiples. Fractional spans on mobile = we fixed that. You're welcome."
      ),
    sam: () =>
      logSecret(
        "Samantha",
        "Placeholder from the template era. Like a coworker who never existed but somehow got credit in the footer."
      ),
  };
}

export function installDevSecrets() {
  if (typeof window === "undefined") return () => {};

  if (!window.__julia) {
    window.__julia = createJuliaConsole();
    printWelcome();
  }

  let konamiIndex = 0;
  let phraseBuffer = "";

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === KONAMI_SEQUENCE[konamiIndex]) {
      konamiIndex += 1;
      if (konamiIndex === KONAMI_SEQUENCE.length) {
        konamiIndex = 0;
        window.__julia?.byteVerse();
      }
      return;
    }
    konamiIndex = event.key === KONAMI_SEQUENCE[0] ? 1 : 0;

    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key.length !== 1) return;

    const target = event.target as HTMLElement | null;
    if (
      target &&
      (target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT")
    ) {
      return;
    }

    phraseBuffer = (phraseBuffer + event.key.toLowerCase()).slice(-12);
    for (const [phrase, handler] of Object.entries(SECRET_PHRASES)) {
      if (phraseBuffer.endsWith(phrase)) {
        phraseBuffer = "";
        handler();
        break;
      }
    }
  };

  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}
