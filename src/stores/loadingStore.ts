import { atom } from "nanostores";

export const $openLoading = atom(false);

export const loadingActions = {
  show() {
    $openLoading.set(true);
  },
  hide() {
    $openLoading.set(false);
  },
  toggle() {
    $openLoading.set(!$openLoading.get());
  },
};