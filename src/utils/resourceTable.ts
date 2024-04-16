const NoOfResources = 4;
const MaxTimeDuaration = 1000;
const MinReachTime = 10;
const ThresholdDistance = 100;

class ResourseTable {
    // resources: 2D array of resources x time
    private static Instance: ResourseTable;
    private resources = new Array(NoOfResources).fill(-1).map(() => new Array(MaxTimeDuaration).fill(-1));
    private currntTime = 0;

    private constructor() {
        this.resources = new Array(NoOfResources).fill(-1).map(() => new Array(MaxTimeDuaration).fill(-1));
    }

    public static getInstance(): ResourseTable {
        if (!ResourseTable.Instance) {
            ResourseTable.Instance = new ResourseTable();
        }

        return ResourseTable.Instance;
    }

    public getTable(): number[][] {
        return this.resources;
    }

    public allocateResources(resources: number[], laneNo: number): number {
        // get the time where a resource is allocated for this lane
        let time = this.currntTime + MinReachTime;
        while (this.resources[laneNo][time] == laneNo) {
            time= (time - 1) > 0 ? time - 1 : MaxTimeDuaration-1;
            if (time == this.currntTime) {
                break;
            }
        }

        // find the time where all the resources are available
        let i = time+1;
        while (i != this.currntTime) {
            i = (i + 1) % MaxTimeDuaration;
            let j = 0;
            for (j = 0; j < resources.length; j++) {
                if (this.resources[resources[j]][i] != -1) {
                    break;
                }
            }
            if (j == resources.length) {
                for (j = 0; j < resources.length; j++) {
                    this.resources[resources[j]][i] = laneNo;
                }
                break;
            }
        }

        // calculate the new speed required to reach the intersection at time i
        let actualTime = i - this.currntTime;
        if (actualTime < 0) {
            actualTime += MaxTimeDuaration;
        }
        let newSpeed = ThresholdDistance / actualTime;

        return newSpeed;
    }

    public updateCurrentTime() {
        this.resources.forEach(resource => {
            resource[this.currntTime] = -1;
        });
        this.currntTime = (this.currntTime + 1) % MaxTimeDuaration;
    }

    public getLaneNo(resource: number, time: number): number {
        return this.resources[resource][time];
    }

}