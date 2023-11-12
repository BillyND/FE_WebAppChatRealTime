import { createSubscription } from "global-state-hook";
import { initInfoUser } from "./constant";

export const infoUserSubscription = createSubscription(initInfoUser);
