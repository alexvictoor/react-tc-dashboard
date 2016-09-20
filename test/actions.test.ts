import { expect } from "chai";
import { createNotificationFromRawData, BuildNotification, Action, types } from "../src/actions";
import * as moment from 'moment';

describe('Action creator', () => {

  it('should parse data from TC', () => {
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
        
        // when
        const notification = createNotificationFromRawData(raw);
        // then
        const expected: Action<BuildNotification> = {
          type: types.BUILD_NOTIFICATION,
          payload: {
              buildId: "Dummy_DuDu",
              buildName: "Dummy",
              buildNumber: 2,
              buildDate: new Date(Date.UTC(2016, 8, 4, 17, 26, 50)),
              success: false,
              statusText: "Filesystem full (new)"
              
          }   
        };
        // then
        expect(notification).to.be.deep.equal(expected);
        
  });
});
       