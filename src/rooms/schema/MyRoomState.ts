import { Schema, MapSchema, type } from "@colyseus/schema";

export class Vehicle extends Schema {
  @type("string") id: string;
  //@type("number") x: number;
  //@type("number") y: number;
  @type("number") speed: number;
}

export class MyRoomState extends Schema {

  // @type("string") mySynchronizedProperty: string = "Hello world";
  @type({ map: Vehicle }) vehicles = new MapSchema<Vehicle>();

}
