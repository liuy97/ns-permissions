import { Component, NgZone } from "@angular/core";
import { DemoSharedPermissions } from "@demo/shared";
import {} from "@ns/permissions";

@Component({
  selector: "demo-permissions",
  templateUrl: "permissions.component.html",
})
export class PermissionsComponent {
  demoShared: DemoSharedPermissions;

  constructor(private _ngZone: NgZone) {}

  ngOnInit() {
    this.demoShared = new DemoSharedPermissions();
  }
}
