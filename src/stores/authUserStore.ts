import { atom } from "nanostores";
import type { UserInfoType } from "../types/user";

export const $authUser = atom<UserInfoType | null | undefined>(undefined);