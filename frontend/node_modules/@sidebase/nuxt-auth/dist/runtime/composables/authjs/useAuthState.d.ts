import type { Session } from 'next-auth';
import type { CommonUseAuthStateReturn } from '../../types.js';
export type SessionData = Session;
interface UseAuthStateReturn extends CommonUseAuthStateReturn<SessionData> {
}
export declare const useAuthState: () => UseAuthStateReturn;
export default useAuthState;
