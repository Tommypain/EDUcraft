/**
 * EDUcraft Dynamic Runtime Capabilities
 *
 * Centralized capability management.
 * Controls dynamic activation of subsystems (images, questions, mindmap, canvas_a4, katex, code_highlight, audio, video, editor).
 */

export interface RuntimeCapabilities {
  images: boolean;
  questions: boolean;
  mindmap: boolean;
  canvas_a4: boolean;
  katex: boolean;
  code_highlight: boolean;
  audio: boolean;
  video: boolean;
  editor: boolean;
  custom?: Record<string, boolean>;
}

export const DEFAULT_CAPABILITIES: RuntimeCapabilities = {
  images: true,
  questions: true,
  mindmap: true,
  canvas_a4: true,
  katex: true,
  code_highlight: true,
  audio: false,
  video: false,
  editor: true,
  custom: {},
};

/**
 * Negotiate runtime capabilities from a book's declared capability list.
 * If capabilities array is absent or empty, falls back to full default profile.
 */
export function negotiateCapabilities(
  declaredCapabilities?: string[]
): RuntimeCapabilities {
  if (!declaredCapabilities || declaredCapabilities.length === 0) {
    return { ...DEFAULT_CAPABILITIES };
  }

  const set = new Set(declaredCapabilities.map((c) => c.toLowerCase().trim()));

  return {
    images: set.has("images") || set.has("image"),
    questions: set.has("questions") || set.has("quiz"),
    mindmap: set.has("mindmap") || set.has("tree"),
    canvas_a4: set.has("canvas_a4") || set.has("a4"),
    katex: set.has("katex") || set.has("math") || set.has("latex"),
    code_highlight: set.has("code_highlight") || set.has("prism") || set.has("code"),
    audio: set.has("audio"),
    video: set.has("video"),
    editor: set.has("editor"),
    custom: Object.fromEntries(
      Array.from(set)
        .filter(
          (k) =>
            ![
              "images", "image", "questions", "quiz", "mindmap", "tree",
              "canvas_a4", "a4", "katex", "math", "latex",
              "code_highlight", "prism", "code", "audio", "video", "editor",
            ].includes(k)
        )
        .map((k) => [k, true])
    ),
  };
}

export class CapabilityManager {
  private capabilities: RuntimeCapabilities;

  constructor(capabilities: RuntimeCapabilities = DEFAULT_CAPABILITIES) {
    this.capabilities = { ...capabilities };
  }

  public setBook(declaredCapabilities?: string[]): void {
    this.capabilities = negotiateCapabilities(declaredCapabilities);
  }

  public can(capabilityName: keyof RuntimeCapabilities | string): boolean {
    if (capabilityName in this.capabilities) {
      const val = (this.capabilities as any)[capabilityName];
      return typeof val === "boolean" ? val : false;
    }
    return Boolean(this.capabilities.custom?.[capabilityName]);
  }

  public getSnapshot(): RuntimeCapabilities {
    return { ...this.capabilities };
  }
}

export const globalCapabilityManager = new CapabilityManager();
