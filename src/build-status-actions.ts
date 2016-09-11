
export interface Action<T> {
    type: string,
    payload: T
}

export interface BuildNotification {
    success : boolean;
    buildId : string;
    buildName : string;    
    buildNumber: number;
    buildDate: Date;
}

export const types = {
  BUILD_NOTIFICATION : "BUILD_NOTIFICATION",
  CLOCK_TICK : "CLOCK_TICK"  
}


export const createNotification = (notification : BuildNotification) : Action<BuildNotification> => (
    { 
        type: types.BUILD_NOTIFICATION,
        payload: notification 
    }
); 

export const createClockTick = (tick : number) : Action<number> => (
    { 
        type: types.CLOCK_TICK,
        payload: tick 
    }
);