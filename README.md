# ns-permissions

Nativescript permissions, which is a clone of [nativescript-perms](https://github.com/farfromrefug/nativescript-perms), exports more android functions and supports advanced request for android permissions.

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

### Supported permissions types

The current supported permissions are:

|                    | Type                | iOS | Android |
| ------------------ | ------------------- | --- | ------- |
| Location           | `location`          | ✔  | ✔       |
| Camera             | `camera`            | ✔  | ✔       |
| Microphone         | `microphone`        | ✔  | ✔       |
| Photos             | `photo`             | ✔  | ✔       |
| Contacts           | `contacts`          | ✔  | ✔       |
| Events             | `event`             | ✔  | ✔       |
| Bluetooth          | `bluetooth`         | ✔  | ❌      |
| Reminders          | `reminder`          | ✔  | ❌      |
| Push Notifications | `notification`      | ✔  | ❌      |
| Background Refresh | `backgroundRefresh` | ✔  | ❌      |
| Speech Recognition | `speechRecognition` | ✔  | ❌      |
| Media Library      | `mediaLibrary`      | ✔  | ❌      |
| Motion Activity    | `motion`            | ✔  | ❌      |
| Storage            | `storage`           | ❌️ | ✔       |
| Phone Call         | `callPhone`         | ❌️ | ✔       |
| Read SMS           | `readSms`           | ❌️ | ✔       |
| Receive SMS        | `receiveSms`        | ❌️ | ✔       |

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
| `hasPermission()`           | `type`    | - Returns the permission status. See iOS Notes for special cases                                                                                                                                                                                                  |
| `request()`         | `type`    | - Accepts any permission type except `backgroundRefresh`. If the current status is `undetermined`, shows the permission dialog and returns a promise with the resulting status. Otherwise, immediately return a promise with the current status. See iOS Notes for special cases |
| `checkPermissions()`   | `[types]` | - Accepts an array of permission types and returns a promise with an object mapping permission types to statuses                                                                                                                                                                 |
| `requestPermissions()`   | `[types]` | - Accepts an array of permission types and request multiple permissions |
| `getTypes()`        | _none_    | - Returns an array of valid permission types                                                                                                                                                                                                                                     |
| `openSettings()`    | _none_    | - _(iOS only - 8.0 and later)_ Switches the user to the settings page of your app                                                                                                                                                                                                |
| `canOpenSettings()` | _none_    | - _(iOS only)_ Returns a boolean indicating if the device supports switching to the settings page                                                                                                                                                                                |

### iOS Notes

* Permission type `bluetooth` represents the status of the
  `CBPeripheralManager`. Don't use this if only need `CBCentralManager`
* Permission type `location` accepts a second parameter for `request()` and
  `check()`; the second parameter is a string, either `always` or `whenInUse`
  (default).
* Permission type `notification` accepts a second parameter for `request()`. The
  second parameter is an array with the desired alert types. Any combination of
  `alert`, `badge` and `sound` (default requests all three).
* If you are not requesting mediaLibrary then you can remove MediaPlayer.framework from the xcode project

```js
// example
Permissions.check('location', { type: 'always' }).then(response => {
  this.setState({ locationPermission: response[0] })
})

Permissions.request('location', { type: 'always' }).then(response => {
  this.setState({ locationPermission: response[0] })
})

Permissions.request('notification', { type: ['alert', 'badge'] }).then(
  response => {
    this.setState({ notificationPermission: response[0] })
  },
)
```

* You cannot request microphone permissions on the simulator.
* With Xcode 8, you now need to add usage descriptions for each permission you
  will request. Open Xcode ➜ `Info.plist` ➜ Add a key (starting with "Privacy -
  ...") with your kit specific permission.

Example: If you need Contacts permission you have to add the key `Privacy -
Contacts Usage Description`.

<img width="338" alt="3cde3b44-7ffd-11e6-918b-63888e33f983" src="https://cloud.githubusercontent.com/assets/1440796/18713019/271be540-8011-11e6-87fb-c3828c172dfc.png">

#### App Store submission disclaimer

If you need to submit you application to the AppStore, you need to add to your
`Info.plist` all `*UsageDescription` keys with a string value explaining to the
user how the app uses this data. **Even if you don't use them**.

So before submitting your app to the App Store, make sure that in your
`Info.plist` you have the following keys:

```xml
<key>NSBluetoothPeripheralUsageDescription</key>
<string>Some description</string>
<key>NSCalendarsUsageDescription</key>
<string>Some description</string>
<key>NSCameraUsageDescription</key>
<string>Some description</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Some description</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Some description</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Some description</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>Some description</string>
<key>NSAppleMusicUsageDescription</key>
<string>Some description</string>
<key>NSMotionUsageDescription</key>
<string>Some description</string>
```
This is required because during the phase of processing in the App Store
submission, the system detects that you app contains code to request the
permission `X` but don't have the `UsageDescription` key and then it rejects the
build.

> Please note that it will only be shown to the users the usage descriptions of
> the permissions you really require in your app.

You can find more information about this issue in #46.

### Android Notes

* All required permissions also need to be included in the `AndroidManifest.xml`
  file before they can be requested. Otherwise `request()` will immediately
  return `denied`.
* You can request write access to any of these types by also including the
  appropriate write permission in the `AndroidManifest.xml` file. Read more
  [here](https://developer.android.com/guide/topics/security/permissions.html#normal-dangerous).

* The optional rationale argument will show a dialog prompt.

```ts
// example
Permissions.request('camera', {
  rationale: {
    title: 'Cool Photo App Camera Permission',
    message:
      'Cool Photo App needs access to your camera ' +
      'so you can take awesome pictures.',
  },
}).then(response => {
  this.setState({ cameraPermission: response[0] })
})
```

## License

Apache License Version 2.0, January 2004
