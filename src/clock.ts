import { Action, types, BuildNotification } from "./actions"

export default (state: Date = new Date(), action: Action<any>) : Date => {
  if (action && action.type === types.CLOCK_TICK) {
    return  (action as Action<Date>).payload;
  }
  return state;
}