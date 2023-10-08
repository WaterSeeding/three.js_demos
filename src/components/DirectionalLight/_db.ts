import Dexie, { Table } from "dexie";
import { DirectionalLightParamsInterface } from "./_typings";

export const db = new Dexie("ThreeDirectionalLightDB");

db.version(1).stores({
  DirectionalLight: "++id, visible, intensity, *color, *position",
});

export type DirectionalLightTableInterface = Table<DirectionalLightParamsInterface>;

export const directionalLightTable: DirectionalLightTableInterface =
  db.table("DirectionalLight");
