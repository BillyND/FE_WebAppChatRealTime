import { createSubscription } from "global-state-hook";
import { initInfoUser } from "../constant";
import { styleDark } from "../hooks/useStyleApp";

export const infoUserSubscription = createSubscription(initInfoUser);

export const listPostSubs = createSubscription({ listPost: [], loading: true });

export const detailPostSubs = createSubscription({});

export const styleAppSubscription = createSubscription(styleDark);
