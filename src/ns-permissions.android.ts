import * as application from '@nativescript/core/application';
import * as applicationSettings from '@nativescript/core/application-settings';
import { CheckOptions, Rationale, RequestOptions, Status, Permissions, AndroidPermissions } from './index';

export * from './ns-permissions.common';

export const permissionTypes = {
    get location() {
        return android.Manifest.permission.ACCESS_FINE_LOCATION;
    },
    get camera() {
        return android.Manifest.permission.CAMERA;
    },
    get microphone() {
        return android.Manifest.permission.RECORD_AUDIO;
    },
    get contacts() {
        return android.Manifest.permission.READ_CONTACTS;
    },
    get event() {
        return android.Manifest.permission.READ_CALENDAR;
    },
    get storage() {
        return android.Manifest.permission.READ_EXTERNAL_STORAGE;
    },
    get photo() {
        return android.Manifest.permission.WRITE_EXTERNAL_STORAGE;
    },
    get callPhone() {
        return android.Manifest.permission.CALL_PHONE;
    },
    get readSms() {
        return android.Manifest.permission.READ_SMS;
    },
    get receiveSms() {
        return android.Manifest.permission.RECEIVE_SMS;
    }
};

const STORAGE_KEY = '@NSPermissions:didAskPermission:';

const setDidAskOnce = (permission: string) => Promise.resolve().then(() => applicationSettings.setBoolean(STORAGE_KEY + permission, true));

const getDidAskOnce = (permission: string) => Promise.resolve(!!applicationSettings.getBoolean(STORAGE_KEY + permission));

export enum PermissionStatus {
    GRANTED = 'authorized',
    DENIED = 'denied',
    NEVER_ASK_AGAIN = 'never_ask_again'
}

export namespace PermissionsAndroid {

    /**
     * Returns a promise resolving to a boolean value as to whether the specified
     * permissions has been granted
     *
     * See https://facebook.github.io/react-native/docs/permissionsandroid.html#check
     */
    export function check(permission: string) {
        const context: android.content.Context = application.android.foregroundActivity || application.android.startActivity;
        if (android.os.Build.VERSION.SDK_INT < 23) {
            return Promise.resolve(context.checkPermission(permission, android.os.Process.myPid(), android.os.Process.myUid()) === android.content.pm.PackageManager.PERMISSION_GRANTED);
        }
        return Promise.resolve((context as any).checkSelfPermission(permission) === android.content.pm.PackageManager.PERMISSION_GRANTED);
    }

    export function hasPermission(permission: string): boolean {
        const context: android.content.Context = application.android.foregroundActivity || application.android.startActivity;
        if (android.os.Build.VERSION.SDK_INT < 23) {
            return context.checkPermission(permission, android.os.Process.myPid(), android.os.Process.myUid()) === android.content.pm.PackageManager.PERMISSION_GRANTED;
        }
        return (context as any).checkSelfPermission(permission) === android.content.pm.PackageManager.PERMISSION_GRANTED;
    }

    /**
     * Prompts the user to enable a permission and returns a promise resolving to a
     * string value indicating whether the user allowed or denied the request
     *
     * See https://facebook.github.io/react-native/docs/permissionsandroid.html#request
     */
    export async function request(permission: string, rationale?: Rationale): Promise<PermissionStatus> {
        // if (rationale) {
        //     const shouldShowRationale = await shouldShowRequestPermissionRationale(permission);

        //     if (shouldShowRationale) {
        //         return new Promise((resolve, reject) => {

        //             NativeModules.DialogManagerAndroid.showAlert(rationale, () => reject(new Error('Error showing rationale')), () => resolve(requestPermission(permission)));
        //         });
        //     }
        // }
        return requestPermission(permission);
    }

    /**
     * Prompts the user to enable multiple permissions in the same dialog and
     * returns an object with the permissions as keys and strings as values
     * indicating whether the user allowed or denied the request
     *
     * See https://facebook.github.io/react-native/docs/permissionsandroid.html#requestPermissions
     */
    export function requestPermissions(permissions: string[]): Promise<{ [permission: string]: Status }> {
        return requestMultiplePermissions(permissions);
    }
}

let mRequestCode = 0;
function requestPermission(permission: string): Promise<PermissionStatus> {
    const activity: android.app.Activity = application.android.foregroundActivity || application.android.startActivity;
    if (android.os.Build.VERSION.SDK_INT < 23) {
        return Promise.resolve(
            activity.checkPermission(permission, android.os.Process.myPid(), android.os.Process.myUid()) === android.content.pm.PackageManager.PERMISSION_GRANTED
                ? PermissionStatus.GRANTED
                : PermissionStatus.DENIED
        );
    }
    if ((activity as any).checkSelfPermission(permission) === android.content.pm.PackageManager.PERMISSION_GRANTED) {
        return Promise.resolve(PermissionStatus.GRANTED);
    }

    return new Promise((resolve, reject) => {
        try {
            const requestCode = mRequestCode++;
            (activity as any).requestPermissions([permission], requestCode);
            application.android.on(application.AndroidApplication.activityRequestPermissionsEvent, (args: application.AndroidActivityRequestPermissionsEventData) => {
                if (args.requestCode === requestCode) {
                    if (args.grantResults.length > 0 && args.grantResults[0] === android.content.pm.PackageManager.PERMISSION_GRANTED) {
                        resolve(PermissionStatus.GRANTED);
                    } else {
                        if ((activity as any).shouldShowRequestPermissionRationale(permission)) {
                            resolve(PermissionStatus.DENIED);
                        } else {
                            resolve(PermissionStatus.NEVER_ASK_AGAIN);
                        }
                    }
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

function requestMultiplePermissions(permissions: string[]): Promise<{ [permission: string]: Status }> {
    const grantedPermissions = {};
    const permissionsToCheck = [];
    let checkedPermissionsCount = 0;

    const context: android.content.Context = application.android.foregroundActivity || application.android.startActivity;

    for (let i = 0; i < permissions.length; i++) {
        const perm = permissions[i];

        if (android.os.Build.VERSION.SDK_INT < 23) {
            grantedPermissions[perm] =
                context.checkPermission(perm, android.os.Process.myPid(), android.os.Process.myUid()) === android.content.pm.PackageManager.PERMISSION_GRANTED
                    ? PermissionStatus.GRANTED
                    : PermissionStatus.DENIED;
            checkedPermissionsCount++;
        } else if ((context as any).checkSelfPermission(perm) === android.content.pm.PackageManager.PERMISSION_GRANTED) {
            grantedPermissions[perm] = PermissionStatus.GRANTED;
            checkedPermissionsCount++;
        } else {
            permissionsToCheck.push(perm);
        }
    }
    if (permissions.length === checkedPermissionsCount) {
        return Promise.resolve(grantedPermissions);
    }

    const activity: android.app.Activity = application.android.foregroundActivity || application.android.startActivity;
    return new Promise((resolve, reject) => {
        try {
            const requestCode = mRequestCode++;
            (activity as any).requestPermissions(permissionsToCheck, requestCode);
            application.android.on(application.AndroidApplication.activityRequestPermissionsEvent, (args: application.AndroidActivityRequestPermissionsEventData) => {
                if (args.requestCode === requestCode) {
                    const results = args.grantResults;
                    for (let j = 0; j < permissionsToCheck.length; j++) {
                        const permission = permissionsToCheck[j];
                        if (results.length > j && results[j] === android.content.pm.PackageManager.PERMISSION_GRANTED) {
                            grantedPermissions[permission] = PermissionStatus.GRANTED;
                        } else {
                            if ((activity as any).shouldShowRequestPermissionRationale(permission)) {
                                grantedPermissions[permission] = PermissionStatus.DENIED;
                            } else {
                                grantedPermissions[permission] = PermissionStatus.NEVER_ASK_AGAIN;
                            }
                        }
                    }
                    resolve(grantedPermissions);
                }

                // if (args.grantResults.length > 0 && args.grantResults[0] === android.content.pm.PackageManager.PERMISSION_GRANTED) {
                //     resolve(PermissionStatus.GRANTED);
                // } else {
                //     if (activity.shouldShowRequestPermissionRationale(permission)) {
                //         resolve(PermissionStatus.DENIED);
                //     } else {
                //         resolve(PermissionStatus.NEVER_ASK_AGAIN);
                //     }
                // }
            });
        } catch (e) {
            reject(e);
        }
    });
}

function shouldShowRequestPermissionRationale(permission: string) {
    if (android.os.Build.VERSION.SDK_INT < 23) {
        return Promise.resolve(false);
    }
    const activity: android.app.Activity = application.android.foregroundActivity || application.android.startActivity;
    try {
        return Promise.resolve((activity as any).shouldShowRequestPermissionRationale(permission));
    } catch (e) {
        return Promise.reject(e);
    }
}

export function canOpenSettings() {
    return Promise.resolve(false);
}

export function openSettings() {
    return Promise.reject(new Error("'openSettings' is deprecated on android"));
}

export function getTypes() {
    return Object.keys(permissionTypes);
}

export function check(aPermission: Permissions, options?: CheckOptions): Promise<[Status, boolean]> {
    const permission = permissionTypes[aPermission] ? permissionTypes[aPermission] : aPermission.toString();

    return PermissionsAndroid.check(permission).then(isAuthorized => {
        if (isAuthorized) {
            return Promise.resolve(['authorized', true]);
        }

        return getDidAskOnce(permission).then(didAsk => {
            if (didAsk) {
                return shouldShowRequestPermissionRationale(permission).then(shouldShow => [shouldShow ? 'denied' : 'restricted', true]);
            }

            return Promise.resolve(['undetermined', true]);
        });
    });
}

export function hasPermission(aPermission: Permissions): boolean {
    const permission = permissionTypes[aPermission] ? permissionTypes[aPermission] : aPermission.toString();
    return PermissionsAndroid.hasPermission(permission);
}

export function request(aPermission: Permissions, options?: RequestOptions): Promise<[Status, boolean] | { [permission: string]: [Status, boolean] }> {
    const permission = permissionTypes[aPermission] ? permissionTypes[aPermission] : aPermission.toString();
    const rationale = typeof options === 'string' ? undefined : options && options.rationale;
    return PermissionsAndroid.request(permission, rationale).then(result => {
        // PermissionsAndroid.request() to native module resolves to boolean
        // rather than string if running on OS version prior to Android M
        if (typeof result === 'boolean') {
            return [result ? 'authorized' : 'denied', true];
        }

        return setDidAskOnce(permission).then(() => [result as Status, true]);
    });
}

export function requestPermissions(permissions: Permissions[]): Promise<{ [permission: string]: Status }> {
    const requestPermissions = new Set<string>(permissions.map(p => permissionTypes[p] ? permissionTypes[p] : p.toString()));
    return requestMultiplePermissions(Array.from(requestPermissions));
}

export function checkPermissions(permissions: Permissions[]): Promise<{ [k: string]: string }> {
    return Promise.all(permissions.map(permission => check(permission))).then(result =>
        result.reduce((acc, value, index) => {
            const name = permissions[index];
            acc[name] = value;
            return acc;
        }, {})
    );
}
