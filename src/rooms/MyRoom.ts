import { Room, Client } from "@colyseus/core";
import { MyRoomState, Vehicle } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate (options: any) {
    this.setState(new MyRoomState());

    this.onMessage("move", (client, message : {x: number, y: number, speed : number}) => {
      const vehicle = this.state.vehicles.get(client.sessionId);
      // vehicle.x = message.x || vehicle.x+vehicle.speed;
      // vehicle.y = message.y || vehicle.y+vehicle.speed;
      // vehicle.speed = message.speed || vehicle.speed;
    });

    // this.setSimulationInterval(() => this.state.vehicles.forEach(vehicle => {
      // vehicle.x += vehicle.speed;
      // vehicle.y += vehicle.speed;
      // get the vehicles that are in close proximity to this vehicle and update their speed to coordinate traffic
    //   let speed = vehicle.speed;
    //   let closestVehicles : Vehicle[] = [];
    //   this.state.vehicles.forEach(vehicle2 => {
    //     if (vehicle.id !== vehicle2.id) {
    //       const distance = Math.sqrt(Math.pow(vehicle.x - vehicle2.x, 2) + Math.pow(vehicle.y - vehicle2.y, 2));
    //       if (distance < 100) {
    //         closestVehicles.push(vehicle2);
    //       }
    //     }
    //   });
    //   if (closestVehicles.length > 0) {
    //     closestVehicles.forEach(vehicle2 => {
    //       // update the speed of the vehicle to avoid collision
    //     });
    //   }
    // }), 1000);

  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.vehicles.set(client.sessionId, new Vehicle());
    this.state.vehicles.get(client.sessionId).id = client.sessionId;
    // this.state.vehicles.get(client.sessionId).x = Math.floor(Math.random() * 800);
    // this.state.vehicles.get(client.sessionId).y = Math.floor(Math.random() * 600);
    // this.state.vehicles.get(client.sessionId).speed = 1;
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.vehicles.delete(client.sessionId);
  }

  onBeforePatch(state: MyRoomState): void | Promise<any> {
    
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");

  }

}
