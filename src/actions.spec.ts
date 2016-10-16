import { expect } from "chai";
import * as moment from 'moment';
import { isNewBuild, parseBuildNotification, createNotification, BuildNotification, Action, types } from "./actions";
import { createStore } from "./reducers";



describe('Action creator', () => {
  
  // given
    const raw = { 
          "id": 2, 
          "buildTypeId": "Dummy_DuDu", 
          "number": "2", 
          "status": "FAILURE", 
          "state": "finished", 
          "href": "/httpAuth/app/rest/builds/id:2", 
          "webUrl": "http://127.0.0.1:9444/viewLog.html?buildId=2&buildTypeId=Dummy_DuDu", 
          "statusText": "Filesystem full (new)", 
          "buildType": { 
              "id": "Dummy_DuDu", 
              "name": "Dummy ::DuDu", 
              "projectName": "Dummy", 
              "projectId": "Dummy", 
              "href": "/httpAuth/app/rest/buildTypes/id:Dummy_DuDu", 
              "webUrl": "http://127.0.0.1:9444/viewType.html?buildTypeId=Dummy_DuDu" 
          }, 
          "queuedDate": "20160904T192639+0200", 
          "startDate": "20160904T192645+0200", 
          "finishDate": "20160904T192650+0200", 
          "triggered": { 
                "type": "user", 
                "date": "20160904T192639+0200", 
                "user": { "username": "alex", "id": 1, "href": "/httpAuth/app/rest/users/id:1" } 
          }, 
          "changes": { 
                "href": "/httpAuth/app/rest/changes?locator=build:(id:2)" 
          }, 
          "revisions": { "count": 0 }, 
          "agent": { 
                "id": 1, 
                "name": "AlexLaptop", 
                "typeId": 1, 
                "href": "/httpAuth/app/rest/agents/id:1" 
          }, 
            "problemOccurrences": { 
                "count": 1, 
                "href": "/httpAuth/app/rest/problemOccurrences?locator=build:(id:2)", "default": false 
          }, 
          "artifacts": { "href": "/httpAuth/app/rest/builds/id:2/artifacts/children/" }, 
          "relatedIssues": { "href": "/httpAuth/app/rest/builds/id:2/relatedIssues" }, 
          "statistics": { "href": "/httpAuth/app/rest/builds/id:2/statistics" } 
        }

  it('should parse data from TC', () => {
    
      // when
      const notification = createNotification(parseBuildNotification(raw));
      // then
      const expected: Action<BuildNotification> = {
      type: types.BUILD_NOTIFICATION,
      payload: {
            buildId: "Dummy_DuDu",
            buildName: "Dummy",
            buildDate: new Date(Date.UTC(2016, 8, 4, 17, 26, 50)),
            success: false,
            statusText: "Filesystem full (new)"
            
      }   
      };
      // then
      expect(notification).to.be.deep.equal(expected);

  });

  it('should detect notification for new build', () => {
    // given
    const store = createStore({});
    const notification = createNotification(parseBuildNotification(raw));
    store.dispatch(notification);
    // when
    const buildNotification = Object.assign(notification.payload, { buildDate: new Date() });
    const newBuild = isNewBuild(buildNotification, store.getState());
    // then
    expect(newBuild).to.be.true;
  });

  it('should view as new any build on intial state', () => {
    // given
    const store = createStore({});
    // when
    const buildNotification = parseBuildNotification(raw);
    const newBuild = isNewBuild(buildNotification, store.getState());
    // then
    expect(newBuild).to.be.true;
  });

  it('should detect notification already consumed', () => {
    // given
    const store = createStore({});
    const notification = createNotification(parseBuildNotification(raw));
    store.dispatch(notification);
    // when
    const buildNotification = parseBuildNotification(raw);
    const newBuild = isNewBuild(buildNotification, store.getState());
    // then
    expect(newBuild).to.be.false;
  });

  it('should take notification into account when status different', () => {
    // given
    const store = createStore({});
    const notification = createNotification(parseBuildNotification(raw));
    store.dispatch(notification);
    // when
    const buildNotification = parseBuildNotification(raw);
    buildNotification.success = !buildNotification.success;
    const newBuild = isNewBuild(buildNotification, store.getState());
    // then
    expect(newBuild).to.be.true;
  });


});
       