

var conf =  {
    teamcityUrl: "https://teamcity.jetbrains.com",
    pollingInterval: 10,
    tickInterval: 20,
    builds: [ 
        "Kotlin_AndroidIntegrationTests",
        "Kotlin_GradleIncrementalCompilationTests",
        "KotlinTools_Exposed_Build"
    ],
    
    successPictures: [
        "img/success/The_fonz_thumbs_up.jpg",
        "img/success/ww.gif",
         
    ],
    failurePictures: [
        "img/failure/3504CB1A00000578-0-image-m-75_1465335445366.jpg",
        "img/failure/3504CB3D00000578-3630245-One_picture_shows_a_road_sign_reading_Thank_you_for_driving_care-a-15_1465487772743.jpg",
        "img/failure/poney.jpg",
        "img/failure/snake.jpg"  
    ]
}
