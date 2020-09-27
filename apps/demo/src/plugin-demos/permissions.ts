import { Observable, EventData, Page } from "@nativescript/core";
import { DemoSharedPermissions } from "@demo/shared";
import {} from "@ns/permissions";

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedPermissions {}
