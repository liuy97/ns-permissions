import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule,
} from "@nativescript/angular";
import { PermissionsComponent } from "./permissions.component";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule.forChild([
      { path: "", component: PermissionsComponent },
    ]),
  ],
  declarations: [PermissionsComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class PermissionsModule {}
