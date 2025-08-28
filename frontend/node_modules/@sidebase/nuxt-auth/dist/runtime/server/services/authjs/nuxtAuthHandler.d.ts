import type { H3Event } from 'h3';
import type { AuthOptions, Session } from 'next-auth';
import type { GetTokenParams } from 'next-auth/jwt';
/** Setup the nuxt (next) auth event handler, based on the passed in options */
export declare function NuxtAuthHandler(nuxtAuthOptions?: AuthOptions): import("h3").EventHandler<import("h3").EventHandlerRequest, Promise<any>>;
/** Gets session on server-side */
export declare function getServerSession(event: H3Event): Promise<Session | null>;
/**
 * Get the decoded JWT token either from cookies or header (both are attempted).
 *
 * The only change from the original `getToken` implementation is that the `req` is not passed in, in favor of `event` being passed in.
 * See https://next-auth.js.org/tutorials/securing-pages-and-api-routes#using-gettoken for further documentation.
 *
 * @param eventAndOptions The event and options used to alter the token behaviour.
 * @param eventAndOptions.event The event to get the cookie or authorization header from that contains the JWT Token
 * @param eventAndOptions.secureCookie boolean to determine if the protocol is secured with https
 * @param eventAndOptions.secret A secret string used for encryption
 */
export declare function getToken<R extends boolean = false>({ event, secureCookie, secret, ...rest }: Omit<GetTokenParams<R>, 'req'> & {
    event: H3Event;
}): Promise<R extends true ? string : import("next-auth/jwt").JWT | null>;
