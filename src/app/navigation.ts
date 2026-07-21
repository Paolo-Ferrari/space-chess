export type AppScreen =
  | "menu"
  | "mode-select"
  | "army-create"
  | "army-ready"
  | "collection"
  | "settings"
  | "match"
  | "victory"
  | "defeat"
  | "mode-stub"
  | "auth"
  | "profile"
  | "my-armies"
  | "match-history";

export type ModeStubKind = "solo" | "friend" | "tutorial";

/** Where to go after successful auth. */
export type AuthReturnTarget =
  | "menu"
  | "profile"
  | "my-armies"
  | "match-history"
  | "army-create"
  | "mode-select";
