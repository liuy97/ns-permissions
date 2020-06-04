export function setDebug(debug:boolean)

export type Status = 'authorized' | 'denied' | 'restricted' | 'undetermined';

export type Permissions =
    | 'location'
    | 'camera'
    | 'microphone'
    | 'photo'
    | 'contacts'
    | 'event'
    | 'reminder'
    | 'bluetooth'
    | 'notification'
    | 'backgroundRefresh'
    | 'speechRecognition'
    | 'mediaLibrary'
    | 'motion'
    | 'storage'
    | 'callPhone'
    | 'readSms'
    | 'receiveSms';
export interface Rationale {
    title: string;
    message: string;
    buttonPositive?: string;
    buttonNegative?: string;
    buttonNeutral?: string;
}

export type CheckOptions = string | { type: string };
export type RequestOptions = string | { type: string; rationale?: Rationale };

export function canOpenSettings(): Promise<boolean>;

export function openSettings(): Promise<boolean>;

export function getTypes(): Permissions[];

export function check(permission: Permissions, options?: CheckOptions): Promise<[Status, boolean]>;
export function hasPermission(permission: string): boolean;

export function request(permission: Permissions, options?: RequestOptions): Promise<[Status, boolean]>;
export function requestMultiple(permissions: string[]): Promise<{ [permission: string]: [Status, boolean] }>;

export function checkMultiple(permissions: Permissions[]): Promise<{ [k: string]: string }>;
