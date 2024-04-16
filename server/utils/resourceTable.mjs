const NoOfResources = 4;
const MaxTimeDuaration = 1000;
const MinReachTime = 10;
const ThresholdDistance = 100;

export default class ResourseTable {
  // resources: 2D array of resources x time
  constructor() {
    this.resources = new Array(NoOfResources)
      .fill(-1)
      .map(() => new Array(MaxTimeDuaration).fill(-1));
    this.currntTime = 0;
  }

  static getInstance() {
    if (!ResourseTable.Instance) {
      ResourseTable.Instance = new ResourseTable();
    }
    return ResourseTable.Instance;
  }

  getTable() {
    return this.resources;
  }

  allocateResources(resources, laneNo, currentTime) {
    let time = currentTime + MinReachTime;

    let i = MaxTimeDuaration;
    while (i >= time && this.resources[laneNo][i] != laneNo) {
      i--;
    }

    time = i;

    while (time < MaxTimeDuaration) {
      let isAvailable = true;
      for (let j = 0; j < resources.length; j++) {
        if (this.resources[resources[j]][time] != -1) {
          isAvailable = false;
          break;
        }
      }
      if(isAvailable) break;
      time++;
    }

    resources.forEach((resource) => {
      this.resources[resource][time] = laneNo;
    });

    return time;
  }
  // allocateResources(resources, laneNo, currntTime) {
  //   let time = currntTime + MinReachTime;
  //   while (this.resources[laneNo][time] == laneNo) {
  //     time = time - 1 > 0 ? time - 1 : MaxTimeDuaration - 1;
  //     if (time == currntTime) {
  //       break;
  //     }
  //   }

  //   let i = time + 1;
  //   while (i != currntTime) {
  //     i = (i + 1) % MaxTimeDuaration;
  //     let j = 0;
  //     for (j = 0; j < resources.length; j++) {
  //       if (this.resources[resources[j]][i] != -1) {
  //         break;
  //       }
  //     }
  //     if (j == resources.length) {
  //       for (j = 0; j < resources.length; j++) {
  //         this.resources[resources[j]][i] = laneNo;
  //       }
  //       break;
  //     }
  //   }

  //   let actualTime = i - currntTime;
  //   if (actualTime < 0) {
  //     actualTime += MaxTimeDuaration;
  //   }
  //   let newSpeed = ThresholdDistance / actualTime;

  //   return newSpeed;
  // }

  updateCurrentTime() {
    this.resources.forEach((resource) => {
      resource[this.currntTime] = -1;
    });
    this.currntTime = (this.currntTime + 1) % MaxTimeDuaration;
  }

  getLaneNo(resource, time) {
    return this.resources[resource][time];
  }
}
