# ns-permissions

Nativescript permissions, which is a clone of [nativescript-perms](https://github.com/farfromrefug/nativescript-perms), exports more android functions and supports advanced request for android permissions.

## Break changes
ns-permissions@2 for Nativescript@7

ns-permissions@1 for Nativescript version < 7

## Installation

```javascript
tns plugin add ns-permissions
```

## API

### Permissions statuses

Promises resolve into ```[status:Status, always:boolean]``` where status is one of these statuses:

| Return value   | Notes                                                                                                                                                                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `authorized`   | User has authorized this permission                                                                                                                                                                                                                                    |
| `denied`       | User has denied this permission at least once. On iOS this means that the user will not be prompted again. Android users can be prompted multiple times until they select 'Never ask me again'                                                                          |
| `restricted`   | **iOS** - this means user is not able to grant this permission, either because it's not supported by the device or because it has been blocked by parental controls. **Android** - this means that the user has selected 'Never ask me again' while denying permission |
| `undetermined` | User has not yet been prompted with a permission dialog                                                                                                                                                                                                                |

The Android permissions are:

| AndroidPermissions     | Android |
| ---------------------- | ------------------- |
| READ_CALENDAR          | 'android.permission.READ_CALENDAR'|
| WRITE_CALENDAR         | 'android.permission.WRITE_CALENDAR'|
| CAMERA                 | 'android.permission.CAMERA' |
| READ_CONTACTS          | 'android.permission.READ_CONTACTS' |
| WRITE_CONTACTS         | 'android.permission.WRITE_CONTACTS' |
| GET_ACCOUNTS           | 'android.permission.GET_ACCOUNTS' |
| ACCESS_FINE_LOCATION   | 'android.permission.ACCESS_FINE_LOCATION' |
| ACCESS_COARSE_LOCATION | 'android.permission.ACCESS_COARSE_LOCATION' |
| RECORD_AUDIO           | 'android.permission.RECORD_AUDIO' |
| READ_PHONE_STATE       | 'android.permission.READ_PHONE_STATE' |
| CALL_PHONE             | 'android.permission.CALL_PHONE' |
| READ_CALL_LOG          | 'android.permission.READ_CALL_LOG' |
| WRITE_CALL_LOG         | 'android.permission.WRITE_CALL_LOG' |
| ADD_VOICEMAIL          | 'com.android.voicemail.permission.ADD_VOICEMAIL' |
| USE_SIP                | 'android.permission.USE_SIP' |
| PROCESS_OUTGOING_CALLS | 'android.permission.PROCESS_OUTGOING_CALLS' |
| BODY_SENSORS           | 'android.permission.BODY_SENSORS' |
| SEND_SMS               | 'android.permission.SEND_SMS' |
| RECEIVE_SMS            | 'android.permission.RECEIVE_SMS' |
| READ_SMS               | 'android.permission.READ_SMS' |
| RECEIVE_WAP_PUSH       | 'android.permission.RECEIVE_WAP_PUSH' |
| RECEIVE_MMS            | 'android.permission.RECEIVE_MMS' |
| READ_EXTERNAL_STORAGE  | 'android.permission.READ_EXTERNAL_STORAGE' |
| WRITE_EXTERNAL_STORAGE | 'android.permission.WRITE_EXTERNAL_STORAGE' |

### Methods

| Method Name         | Arguments | Notes                                                                                                                                                                                                                                                                            |
| ------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `check()`           | `type`    | - Returns a promise with the permission status. See iOS Notes for special cases                                                                                                                                                                                                  |
| `hasPermission()`   | `type`    | - Returns the permission status.                                                                                                                                                                                               |
| `request()`         | `type`    | - Accepts any permission type except `backgroundRefresh`. If the current status is `undetermined`, shows the permission dialog and returns a promise with the resulting status. Otherwise, immediately return a promise with the current status. See iOS Notes for special cases |
| `checkPermissions()`| `Object` | - Accepts an array of permission types and returns a promise with an object mapping permission object map to statuses                                                                                                                                                                 |
| `requestPermissions()` | `[types]` | - Accepts an array of permission types and request multiple permissions |
| `getTypes()`        | _none_    | - Returns an array of valid permission types                                                                                                                                                                                                                                     |
| `openSettings()`    | _none_    | - _(iOS only - 8.0 and later)_ Switches the user to the settings page of your app                                                                                                                                                                                                |
| `canOpenSettings()` | _none_    | - _(iOS only)_ Returns a boolean indicating if the device supports switching to the settings page                                                                                                                                                                                |

```ts
// request Read Contacts Permissions
function requestReadContacts() {
  return new Promise((resolve, reject) => {
    Permissions.check(Permissions.AndroidPermissions.READ_CONTACTS).then((result) => {
      if (result[0] === 'authorized') {
        resolve();
      } else if (result[0] === 'restricted') {
        reject();
      } else {
        Permissions.request(Permissions.AndroidPermissions.READ_CONTACTS).then((requestResult) => {
          requestResult[0] === 'authorized' ? resolve() : reject();
        }).catch(() => reject());
      }
    });
  });
}
```

## License

Apache License Version 2.0, January 2004
