export function setDebug(debug:boolean)

export type Status = 'authorized' | 'denied' | 'restricted' | 'undetermined';

export const enum AndroidPermissions {
  READ_CALENDAR = 'android.permission.READ_CALENDAR',
  WRITE_CALENDAR = 'android.permission.WRITE_CALENDAR',
  CAMERA = 'android.permission.CAMERA',
  READ_CONTACTS = 'android.permission.READ_CONTACTS',
  WRITE_CONTACTS = 'android.permission.WRITE_CONTACTS',
  GET_ACCOUNTS = 'android.permission.GET_ACCOUNTS',
  ACCESS_FINE_LOCATION = 'android.permission.ACCESS_FINE_LOCATION',
  ACCESS_COARSE_LOCATION = 'android.permission.ACCESS_COARSE_LOCATION',
  RECORD_AUDIO = 'android.permission.RECORD_AUDIO',
  READ_PHONE_STATE = 'android.permission.READ_PHONE_STATE',
  CALL_PHONE = 'android.permission.CALL_PHONE',
  READ_CALL_LOG = 'android.permission.READ_CALL_LOG',
  WRITE_CALL_LOG = 'android.permission.WRITE_CALL_LOG',
  ADD_VOICEMAIL = 'com.android.voicemail.permission.ADD_VOICEMAIL',
  USE_SIP = 'android.permission.USE_SIP',
  PROCESS_OUTGOING_CALLS = 'android.permission.PROCESS_OUTGOING_CALLS',
  BODY_SENSORS = 'android.permission.BODY_SENSORS',
  SEND_SMS = 'android.permission.SEND_SMS',
  RECEIVE_SMS = 'android.permission.RECEIVE_SMS',
  READ_SMS = 'android.permission.READ_SMS',
  RECEIVE_WAP_PUSH = 'android.permission.RECEIVE_WAP_PUSH',
  RECEIVE_MMS = 'android.permission.RECEIVE_MMS',
  READ_EXTERNAL_STORAGE = 'android.permission.READ_EXTERNAL_STORAGE',
  WRITE_EXTERNAL_STORAGE = 'android.permission.WRITE_EXTERNAL_STORAGE'
}

export type Permissions =
    'location'
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
    | 'receiveSms'
    | AndroidPermissions;

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
export function hasPermission(permission: Permissions): boolean;

export function request(permission: Permissions, options?: RequestOptions): Promise<[Status, boolean]>;
export function requestPermissions(permissions: Permissions[]): Promise<{ [permission: string]: Status }>;

export function checkPermissions(permissions: Permissions[]): Promise<{ [k: string]: string }>;
