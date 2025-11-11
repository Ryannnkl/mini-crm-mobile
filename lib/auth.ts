import { betterAuth } from "better-auth";

export const auth = betterAuth({
    trustedOrigins: ["mobile://*"]
})