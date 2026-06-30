import { storage } from "wxt/utils/storage";

export interface Profile {
	avatarUrl: string;
	title: string;
	signature: string;
}

export const DEFAULT_PROFILE: Profile = {
	avatarUrl:
		"https://cdn.v2ex.com/gravatar/97227251c4a0e846063fd5f1d5201c92?size=64",
	title: "Walkin",
	signature: "yolo.",
};

export const profileStorage = storage.defineItem<Profile>("local:profile", {
	fallback: DEFAULT_PROFILE,
	version: 1,
});
