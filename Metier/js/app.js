// ***********************************************************
//      Setting Up Constants and Variables
// ***********************************************************

/* <-----  Testing for JS Connection with Index Page  -----> */
const log = console.log;
log('JS is connected');


/* <-----  API Url Constants  -----> */
const jobsApiUrl = '/jobs';
const wagesApiUrl = '/wages';
const blogsApiUrl = '/blogs';
const singleBlogApiUrl = '/blogs/blog';
const jobCategoryApiUrl = '/jobCategoryList';
const defaultHomeDataUrl = '/defaultHomeDataUrl';
const urlHeaderOptions = {
    mode: 'cors',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        // 'Access-Control-Allow-Origin':'*'
        'API-Key': 'secret'
    }
}


/* <-----  Value Constants  -----> */
const defaultProfessionId = 1;
const mapOptions = {
    center: { lat: 60.2971469, lng: -97.4133973 }, // Centre for Canada
    zoom: 3.2,
    minZoom: 3.2,
    maxZoom: 8
}
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]



// ***********************************************************
//      Checking if Dom is ready to initiate process in JS
// ***********************************************************
if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
    domLoaded();
} else {
    document.addEventListener("DOMContentLoaded", domLoaded);
}


function domLoaded() {
    // Handler when the DOM is fully loaded
    var path = window.location.pathname;
    var page = path.split("/").pop();
    log(page);
    initializePage(page);
};


function initializePage(page) {
    switch (page) {
        case "index.html":
            log('Home Page is Loaded !');
            initHomePage();
            break;
        case "explore.html":
            log('Explore Page is Loaded !');
            intiExplorePage();
            break;
        case "blogs.html":
            log('Blogs Page is Loaded !');
            initBlogsPage();
            break;
        case "blogDescription.html":
            log('Blog Description Page is Loaded !');
            initBlogDescriptionPage();
            break;
        default:
            log("Some Other Page is Loaded !");
    }
}



// ***********************************************************
//      Setting Up Home Page
// ***********************************************************

function initHomePage() {
    log('Init Home Page Called');
    /* let map = new google.maps.Map(document.getElementById('general-heat-map'), {
        center: { lat: 60.2971469, lng: -97.4133973 }, // Centre for Canada
        zoom: 3.2
    }); */
    let map = new google.maps.Map(document.getElementById('general-heat-map'), mapOptions);

    // makeApiCallForDefaultProfession(map);
    makeApiCallForHomePageHeatMapData(cityListArr => {
        let citiesDataArr = [];
        cityListArr.forEach(cityObject => {
            citiesDataArr.push({
                lat: cityObject.Lat,
                lng: cityObject.Lng,
                jobCounts: cityObject.Number_Of_Job
            })
        });
        populateHeatMap(map, citiesDataArr);
    });
}

/* 
function makeApiCallForDefaultProfession(map) {
    log('Making Api Request for Jobs');

    let urlString = getApiUrlForJobsWithProfessionID(defaultProfessionId);
    fetch(urlString).then((res) => {
        res.json().then((responseData) => {
            log(responseData);
            let citiesDataArr = [];
            responseData.data.forEach(cityObject => {
                citiesDataArr.push({
                    lat: cityObject.Lat,
                    lng: cityObject.Lng,
                    jobCounts: cityObject.Number_Of_Job
                })
            });
            log(citiesDataArr);
            populateHeatMap(map, citiesDataArr);
        });
    }, (error) => {
        log(error);
    });
}
 */



// ***********************************************************
//      Setting Up Explore Page
// ***********************************************************

function intiExplorePage() {
    log('Init Explore Page Called');
    let map = new google.maps.Map(document.getElementById('heat-map'), mapOptions);

    let barChart = am4core.create('wage-graph', am4charts.XYChart);

    let heatMapSpinner = document.getElementById('heat-map-profession-spinner');
    heatMapSpinner.addEventListener('change', () => {
        let jobCategoryIdSelected = heatMapSpinner.value;
        log('Spinner Value: ' + jobCategoryIdSelected);
        document.getElementById('heat-map').innerHTML = '';
        map = new google.maps.Map(document.getElementById('heat-map'), mapOptions);
        makeApiCallForJobsWithProfessionId(jobCategoryIdSelected, (cityListArr) => {
            let citiesDataArr = [];
            cityListArr.forEach(cityObject => {
                citiesDataArr.push({
                    lat: cityObject.Lat,
                    lng: cityObject.Lng,
                    jobCounts: cityObject.Number_Of_Job
                })
            });
            log(citiesDataArr);
            populateHeatMap(map, citiesDataArr);
        });
    });

    let wagesGraphSpinner = document.getElementById('wages-graph-profession-spinner');
    wagesGraphSpinner.addEventListener('change', () => {
        let jobCategoryIdSelected = wagesGraphSpinner.value;
        log('Spinner Value: ' + jobCategoryIdSelected);
        document.getElementById('wage-graph').innerHTML = '';
        barChart = am4core.create('wage-graph', am4charts.XYChart);
        makeApiCallForWagesWithProfessionId(jobCategoryIdSelected, (wageDataArr) => {
            let provincesDaraArr = [];
            wageDataArr.forEach(provinceObj => {
                provincesDaraArr.push({
                    name: provinceObj.Province_Code,
                    fullName: provinceObj.Province_Name,
                    points: provinceObj.Average_Wage,
                    color: "#2DB9EB"
                })
            });
            log(provincesDaraArr);
            populateBarChart(barChart, provincesDaraArr);
        });
    });

    makeApiCallForJobCategoryList(jobCategoryListArr => {
        fillHeatMapJobCategorySpinner(jobCategoryListArr);
        fillBarChartJobCategorySpinner(jobCategoryListArr);

        let firstProfessionId = jobCategoryListArr[0].Category_ID;

        makeApiCallForJobsWithProfessionId(firstProfessionId, (cityListArr) => {
            let citiesDataArr = [];
            cityListArr.forEach(cityObject => {
                citiesDataArr.push({
                    lat: cityObject.Lat,
                    lng: cityObject.Lng,
                    jobCounts: cityObject.Number_Of_Job
                })
            });
            log(citiesDataArr);
            populateHeatMap(map, citiesDataArr);
        });

        makeApiCallForWagesWithProfessionId(firstProfessionId, (wageDataArr) => {
            let provincesDaraArr = [];
            wageDataArr.forEach(provinceObj => {
                provincesDaraArr.push({
                    name: provinceObj.Province_Code,
                    fullName: provinceObj.Province_Name,
                    points: provinceObj.Average_Wage,
                    color: "#2DB9EB"
                })
            });
            log(provincesDaraArr);
            populateBarChart(barChart, provincesDaraArr);
        });
    });
}


function fillHeatMapJobCategorySpinner(dataArr) {
    for (let i = 0; i < dataArr.length; i++) {
        let spinner = document.getElementById('heat-map-profession-spinner');
        spinner.options[i] = new Option(dataArr[i].Category, dataArr[i].Category_ID);
    }
}


function fillBarChartJobCategorySpinner(dataArr) {
    for (let i = 0; i < dataArr.length; i++) {
        let spinner = document.getElementById('wages-graph-profession-spinner');
        spinner.options[i] = new Option(dataArr[i].Category, dataArr[i].Category_ID);
    }
}



// ***********************************************************
//      Setting Up Blogs Page
// ***********************************************************

function initBlogsPage() {
    log('Init Blogs Page Called');

    makeApiCallForBlogsList(blogsListDataArr => {
        let popularBlogsArr = [];
        let recentBlogsArr = [];
        blogsListDataArr.forEach(blogItem => {
            let blogDateStr = getDateString(blogItem.Blog_Date);
            blogItem.Blog_Date = blogDateStr;
            if (blogItem.Blog_Type === 1) {
                popularBlogsArr.push(blogItem);
            } else {
                recentBlogsArr.push(blogItem);
            }
        });

        log('Popular Blogs Arr');
        log(popularBlogsArr);
        populatePopularBlogsList(popularBlogsArr);

        log('Recent Blogs Arr');
        log(recentBlogsArr);
        populateRecentBlogsList(recentBlogsArr);

        // document.getElementById('blogs-container').addEventListener('click', function () {
        //     blogId = 1;
        //     var queryString = "?blogId=" + blogId;
        //     window.location.href = "blogDescription.html" + queryString;
        // });
    });
}


function populatePopularBlogsList(blogsArr) {
    let blogsContainer = document.getElementById('blogs-container-popular');
    blogsContainer.innerHTML = ``;
    blogsArr.forEach((blog, i) => {
        let htmlString = ``;
        htmlString += `<div class="blog-container blog${i + 1}">`;
        htmlString += `<div class="blog-detail-container">`;
        htmlString += `<img src="${blog.Blog_Image_Thumbnail_Link}" alt="">`;
        htmlString += `<div class="blog-title">${blog.Blog_Title}</div>`;
        htmlString += `<div class="blog-date">${blog.Blog_Date}</div>`;
        // htmlString += `<div class="blog-description">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea, cupiditate.</div>`;
        htmlString += `<a href="blogDescription.html?blogId=${blog.Blog_ID}" class="read-more-button">Read More</a>`;
        htmlString += `</div>`;
        htmlString += `<div class="blog-detail-on-hover" style="background-image: linear-gradient(to right bottom, #0000007e, #000000ee), url(${blog.Blog_Image_Thumbnail_Link});">`;
        htmlString += `<div class="blog-description">${truncateString(blog.Blog_Description, 100)}</div>`;
        htmlString += `<a href="blogDescription.html?blogId=${blog.Blog_ID}" class="read-now-button">Read More</a>`;
        htmlString += `</div>`;
        htmlString += `</div>`;
        blogsContainer.innerHTML += htmlString;
    });
}


function populateRecentBlogsList(blogsArr) {
    let blogsContainer = document.getElementById('blogs-container-recent');
    blogsContainer.innerHTML = ``;
    blogsArr.forEach((blog, i) => {
        let htmlString = ``;
        htmlString += `<div class="blog-container blog${i + 1}">`;
        htmlString += `<div class="blog-detail-container">`;
        htmlString += `<img src="${blog.Blog_Image_Thumbnail_Link}" alt="">`;
        htmlString += `<div class="blog-title">${blog.Blog_Title}</div>`;
        htmlString += `<div class="blog-date">${blog.Blog_Date}</div>`;
        // htmlString += `<div class="blog-description">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea, cupiditate.</div>`;
        htmlString += `<a href="blogDescription.html?blogId=${blog.Blog_ID}" class="read-more-button">Read More</a>`;
        htmlString += `</div>`;
        htmlString += `<div class="blog-detail-on-hover" style="background-image: linear-gradient(to right bottom, #0000007e, #000000ee), url(${blog.Blog_Image_Thumbnail_Link});">`;
        htmlString += `<div class="blog-description">${truncateString(blog.Blog_Description, 100)}</div>`;
        htmlString += `<a href="blogDescription.html?blogId=${blog.Blog_ID}" class="read-now-button">Read More</a>`;
        htmlString += `</div>`;
        htmlString += `</div>`;
        blogsContainer.innerHTML += htmlString;
    });

}



// ***********************************************************
//      Setting Up Blog Description Page
// ***********************************************************

function initBlogDescriptionPage() {
    log('Init Blog Description Page Called');

    const blogId = getBlogId();

    makeApiCallForBlogData(blogId, (blogData) => {
        // log(blogData);
        populateBlogData(blogData[0]);
    });

}


function getBlogId() {
    /* <-----  Primitive way of fetching params  -----> */
    /* var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");
    for (var i = 0; i < queries.length; i++) {
        log(queries[i]);
    } */

    /* <-----  This works on most browsers except IE  -----> */
    let urlParams = new URLSearchParams(window.location.search);
    let myParamVar = urlParams.get('blogId');
    log(myParamVar);

    return myParamVar;
}


function populateBlogData(blogData) {
    document.getElementById('blog-title').innerHTML = blogData.Blog_Title;
    document.getElementById('blog-category').innerHTML = blogData.Blog_Type === 1 ? 'Popular' : 'Recent';
    document.getElementById('blog-date').innerHTML = getDateString(blogData.Blog_Date);
    document.getElementById('blog-image').src = blogData.Blog_Image_Link;
    // log(blogData.Blog_Description);
    document.getElementById('blog-content').innerHTML = blogData.Blog_Description;
    document.getElementById('blog-link').innerHTML = `<a href='${blogData.Blog_Link}+'>Go to the Website</a>`;
}



// ***********************************************************
//      Common Functions
// ***********************************************************

function populateHeatMap(map, citiesDataArr) {
    var heatMapData = [];
    let maxDataValue = Math.max.apply(null, citiesDataArr.map(item => item.jobCounts));
    // log('Max Data Value: ' + maxDataValue);
    citiesDataArr.forEach(city => {
        weightValue = city.jobCounts / maxDataValue * 100;
        // log('Weight Value of ' + city.cityName + ' : ' + weightValue);
        // if (weightValue <= 5) {
        //     weightValue = 11;
        // } else if (weightValue <= 10) {
        //     weightValue = 20;
        // } else if (weightValue <= 20) {
        //     weightValue = 30;
        // } else if (weightValue <= 35) {
        //     weightValue = 40;
        // } else if (weightValue <= 50) {
        //     weightValue = 50;
        // } else if (weightValue <= 80) {
        //     weightValue = 80;
        // } else if (weightValue <= 90) {
        //     weightValue = 90;
        if (weightValue > 0 && weightValue <= 5) {
            weightValue = 5;
        } else {
            // weightValue = 100;
            weightValue = weightValue;
        }
        heatMapData.push({
            location: new google.maps.LatLng(city.lat, city.lng),
            weight: weightValue
            // weight: city.jobCounts
        });
    });

    var heatMap = new google.maps.visualization.HeatmapLayer({
        data: heatMapData
    });

    heatMap.set('opacity', heatMap.get('opacity') ? null : 0.8); //  0.60 is default
    heatMap.set('radius', heatMap.get('radius') ? null : 25); //  25 is default
    heatMap.setMap(map);
}


function populateBarChart(chart, chartData) {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);

        // Add data
        chart.data = chartData;

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.inside = true;
        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        // categoryAxis.renderer.labels.template.fontSize = 20;
        categoryAxis.renderer.labels.template.fontSize = 15;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.strokeDasharray = "4,4";
        valueAxis.renderer.labels.template.disabled = true;
        // valueAxis.min = 0;
        valueAxis.min = Math.min(null, chartData.map(item => item.points));
        // valueAxis.max = Math.max(null, chartData.map(item => item.points));

        // Do not crop bullets
        chart.maskBullets = false;

        // Remove padding
        chart.paddingBottom = 0;

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "points";
        series.dataFields.categoryX = "name";
        series.columns.template.propertyFields.fill = "color";
        series.columns.template.propertyFields.stroke = "color";
        series.columns.template.column.cornerRadiusTopLeft = 0;
        series.columns.template.column.cornerRadiusTopRight = 0;
        // series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/b]";
        series.columns.template.tooltipText = "[font-size: 13]{fullName}: [bold font-size: 13]{valueY}[/b]";
        // console.log(series.columns.template);
        series.tooltip.autoTextColor = false;

    });
}


function getDateString(date) {
    let blogDate = new Date(date);
    let blogDay = blogDate.getDate();
    let blogMonth = blogDate.getMonth();
    let blogYear = blogDate.getFullYear();
    let dateString = `${blogDay} ${months[blogMonth]}, ${blogYear}`;

    return dateString;
}


function truncateString(str, num) {
    if (str.length <= num) {
        return str
    }
    return str.slice(0, num) + '...'
}


function makeApiCallForHomePageHeatMapData(callback) {
    log('Making Api Request for Home Page Heat Map Data');

    let urlString = getApiUrlForDefaultJobsData();
    fetch(urlString).then((res) => {
        res.json().then((responseData) => {
            log(responseData);
            callback(responseData.data);
        });
    }, (error) => {
        log(error);
    });
}


function makeApiCallForJobCategoryList(callback) {
    log('Making Api Request for Job Category List');

    let urlString = getApiUrlForJobCategoryList();
    fetch(urlString).then((res) => {
        res.json().then((responseData) => {
            log(responseData);
            callback(responseData.data);
        });
    }, (error) => {
        log(error);
    });
}


function makeApiCallForJobsWithProfessionId(professionId, callback) {
    log('Making Api Request for Jobs with Category ID: ' + professionId);

    let urlString = getApiUrlForJobsWithProfessionID(professionId);
    fetch(urlString).then((res) => {
        res.json().then((responseData) => {
            log(responseData);
            callback(responseData.data);
        });
    }, (error) => {
        log(error);
    });
}


function makeApiCallForWagesWithProfessionId(professionId, callback) {
    log('Making Api Request for Wages with Category ID: ' + professionId);

    let urlString = getApiUrlForWagesWithProfessionID(professionId);
    fetch(urlString).then((res) => {
        res.json().then((responseData) => {
            log(responseData);
            callback(responseData.data);
        });
    }, (error) => {
        log(error);
    });
}


function makeApiCallForBlogsList(callback) {
    log('Making Api Request for Blogs List');

    let urlString = getApiUrlForBlogsList();
    fetch(urlString).then((res) => {
        res.json().then((responseData) => {
            log(responseData);
            callback(responseData.data);
        });
    }, (error) => {
        log(error);
    });
}


function makeApiCallForBlogData(blogId, callback) {
    log('Making Api Request for Blog Data');

    let urlString = getApiUrlForBlogData(blogId);
    fetch(urlString).then((res) => {
        res.json().then((responseData) => {
            log(responseData);
            callback(responseData.data);
        });
    }, (error) => {
        log(error);
    });
}



// ***********************************************************
//      API Url Functions
// ***********************************************************

function getApiUrlForDefaultJobsData() {
    let apiUrl = getBaseUrl();
    apiUrl += defaultHomeDataUrl;
    log('Url: ' + apiUrl);

    return apiUrl;
}

function getApiUrlForJobCategoryList() {
    let apiUrl = getBaseUrl();
    apiUrl += jobCategoryApiUrl;
    log('Url: ' + apiUrl);

    return apiUrl;
}


function getApiUrlForJobsWithProfessionID(professionId) {
    let apiUrl = getBaseUrl();
    apiUrl += jobsApiUrl;
    apiUrl += `?professionId=${professionId}`;
    log('Url: ' + apiUrl);

    return apiUrl;
}


function getApiUrlForWagesWithProfessionID(professionId) {
    let apiUrl = getBaseUrl();
    apiUrl += wagesApiUrl;
    apiUrl += `?professionId=${professionId}`;
    log('Url: ' + apiUrl);

    return apiUrl;
}


function getApiUrlForBlogsList() {
    let apiUrl = getBaseUrl();
    apiUrl += blogsApiUrl;
    log('Url: ' + apiUrl);

    return apiUrl;
}


function getApiUrlForBlogData(blogId) {
    let apiUrl = getBaseUrl();
    apiUrl += singleBlogApiUrl;
    apiUrl += `?blogId=${blogId}`;
    log('Url: ' + apiUrl);

    return apiUrl;
}


function getBaseUrl() {
    return 'http://localhost:3000';
}
















/*

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('general-heat-map'), {
        center: { lat: 60.2971469, lng: -97.4133973 },
        zoom: 3.4
    });

    populateHeatMap(bcCitiesDataArrSample);
}


function initHeatMap() {
    map = new google.maps.Map(document.getElementById('heat-map'), {
        center: { lat: 60.2971469, lng: -97.4133973 },
        zoom: 3.4
    });

    populateHeatMap(bcCitiesDataArrSample);
}


function populateHeatMap(citiesDataArr) {

    var heatMapData = [];

    citiesDataArr.forEach(city => {
        heatMapData.push({
            location: new google.maps.LatLng(city.lat, city.lng),
            weight: city.jobCounts
        });
    });

    var heatMap = new google.maps.visualization.HeatmapLayer({
        data: heatMapData
    });

    heatMap.set('radius', heatMap.get('radius') ? null : 30);

    // heatMap.set('opacity', heatMap.get('opacity') ? null : 0.2);


    // var gradient = [
    //     'rgba(0, 255, 255, 0)',
    //     'rgba(0, 255, 255, 1)',
    //     'rgba(0, 191, 255, 1)',
    //     'rgba(0, 127, 255, 1)',
    //     'rgba(0, 63, 255, 1)',
    //     'rgba(0, 0, 255, 1)',
    //     'rgba(0, 0, 223, 1)',
    //     'rgba(0, 0, 191, 1)',
    //     'rgba(0, 0, 159, 1)',
    //     'rgba(0, 0, 127, 1)',
    //     'rgba(63, 0, 91, 1)',
    //     'rgba(127, 0, 63, 1)',
    //     'rgba(191, 0, 31, 1)',
    //     'rgba(255, 0, 0, 1)'
    // ];

    // heatMap.set('gradient', heatMap.get('gradient') ? null : gradient);


    heatMap.setMap(map);
}

// populateHeatMap(bcCitiesDataArr);















//***************************************************************************
//      Setting Up Bar Graph Data Chart
//***************************************************************************

am4core.ready(function () {

    // Themes begin
    // am4core.useTheme(am4themes_dataviz);
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("wage-graph", am4charts.XYChart);

    // Add data
    chart.data = [{
        "name": "AB",
        "fullName": "Alberta",
        "points": 7,
        "color": "#2DB9EB",
        "bullet": "https://www.amcharts.com/lib/images/faces/A04.png"
    }, {
        "name": "BC",
        "fullName": "British Columbia",
        "points": 9,
        "color": "#2DB9EB",
        "bullet": "https://www.amcharts.com/lib/images/faces/E01.png"
    }, {
        "name": "MB",
        "fullName": "Manitoba",
        "points": 5,
        "color": "#2DB9EB",
        "bullet": "https://www.amcharts.com/lib/images/faces/C02.png"
    }, {
        "name": "NB",
        "fullName": "New Brunswick",
        "points": 4,
        "color": "#2DB9EB",
        "bullet": "https://www.amcharts.com/lib/images/faces/E01.png"
    }, {
        "name": "NL",
        "fullName": "Newfoundland and Labrador",
        "points": 3,
        "color": "#2DB9EB",
        "bullet": "https://www.amcharts.com/lib/images/faces/E01.png"
    }, {
        "name": "NT",
        "fullName": "Northwest Territories",
        "points": 2,
        "color": "#2DB9EB",
        "bullet": "https://www.amcharts.com/lib/images/faces/E01.png"
    }, {
        "name": "NS",
        "fullName": "Nova Scotia",
        "points": 2,
        "color": "#2DB9EB",
        "bullet": "https://www.amcharts.com/lib/images/faces/D02.png"
    }, {
        "name": "NU",
        "fullName": "Nunavut",
        "points": 1,
        "color": "#2DB9EB",
        "bullet": "https://www.amcharts.com/lib/images/faces/E01.png"
    }, {
        "name": "ON",
        "fullName": "Ontario",
        "points": 9,
        "color": "#2DB9EB",
        "bullet": "https://www.amcharts.com/lib/images/faces/E01.png"
    }, {
        "name": "PE",
        "fullName": "Prince Edward Island",
        "points": 1,
        "color": "#2DB9EB",
        "bullet": "https://www.amcharts.com/lib/images/faces/E01.png"
    }, {
        "name": "QC",
        "fullName": "Quebec",
        "points": 10,
        "color": "#2DB9EB",
        "bullet": "https://www.amcharts.com/lib/images/faces/E01.png"
    }, {
        "name": "SK",
        "fullName": "Saskatchewan",
        "points": 5,
        "color": "#2DB9EB",
        "bullet": "https://www.amcharts.com/lib/images/faces/E01.png"
    }, {
        "name": "YT",
        "fullName": "Yukon",
        "points": 1,
        "color": "#2DB9EB",
        "bullet": "https://www.amcharts.com/lib/images/faces/E01.png"
    }];

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name";
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.inside = true;
    categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
    // categoryAxis.renderer.labels.template.fontSize = 20;
    categoryAxis.renderer.labels.template.fontSize = 15;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeDasharray = "4,4";
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

    // Do not crop bullets
    chart.maskBullets = false;

    // Remove padding
    chart.paddingBottom = 0;

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "points";
    series.dataFields.categoryX = "name";
    series.columns.template.propertyFields.fill = "color";
    series.columns.template.propertyFields.stroke = "color";
    series.columns.template.column.cornerRadiusTopLeft = 15;
    series.columns.template.column.cornerRadiusTopRight = 15;
    // series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/b]";
    series.columns.template.tooltipText = "[font-size: 13]{fullName}: [bold font-size: 13]{valueY}[/b]";
    // console.log(series.columns.template);
    series.tooltip.autoTextColor = false;

    // Add bullets
    // var bullet = series.bullets.push(new am4charts.Bullet());
    // var image = bullet.createChild(am4core.Image);
    // image.horizontalCenter = "middle";
    // image.verticalCenter = "bottom";
    // image.dy = 20;
    // image.y = am4core.percent(100);
    // image.propertyFields.href = "bullet";
    // image.tooltipText = series.columns.template.tooltipText;
    // image.propertyFields.fill = "color";
    // image.filters.push(new am4core.DropShadowFilter());

}); // end am4core.ready()

*/

































/*
var bcCitiesDataArrSample = [{
    name: "Abbotsford",
    lat: 49.0871562,
    lng: -122.54785,
    jobCounts: 20
}, {
    name: "Burnaby",
    lat: 49.2401254,
    lng: -123.0982528,
    jobCounts: 55
}, {
    name: "Coquitlam",
    lat: 49.2851173,
    lng: -122.8266313,
    jobCounts: 13
}, {
    name: "Delta",
    lat: 49.0988425,
    lng: -123.2498592,
    jobCounts: 17
}, {
    name: "Kelowna",
    lat: 49.8998293,
    lng: -119.5948627,
    jobCounts: 34
}, {
    name: "Langley",
    lat: 49.0986473,
    lng: -122.6764025,
    jobCounts: 22
}, {
    name: "North Vancouver",
    lat: 49.3151433,
    lng: -123.0878946,
    jobCounts: 63
}, {
    name: "Richmond",
    lat: 49.1665898,
    lng: -123.133569,
    jobCounts: 58
}, {
    name: "Vancouver",
    lat: 49.2578263,
    lng: -123.1939437,
    jobCounts: 89
}, {
    name: "White Rock",
    lat: 49.0166943,
    lng: -122.8297776,
    jobCounts: 46
}];
 */

document.getElementById("button-contact-submit").addEventListener('click', () => {

    let name = document.getElementById("txtName").value;
    let email = document.getElementById("txtEmail").value;
    let message = document.getElementById("txtMessage").value;
    let displayMessage = document.getElementById("displayMessage");
    displayMessage.innerHTML = '';
    if (!name) {
        displayMessage.innerHTML = 'Please Enter Your Name!';
    } else if (!isNameValid(name)) {
        displayMessage.innerHTML = 'Please Write Valid Name!';
    } else if (!email) {
        displayMessage.innerHTML = 'Please Enter Your Email ID!';
    } else if (!isEmailValid(email)) {
        displayMessage.innerHTML = 'Please Enter Valid Email ID!';
    } else if (!message) {
        displayMessage.innerHTML = 'Please Enter Your Message or Query!';
    } else if (message.length < 100) {
        displayMessage.innerHTML = 'Please enter message of 100 characters atleast!';
    } else {
        document.getElementById("txtName").value = '';
        document.getElementById("txtEmail").value ='';
        document.getElementById("txtMessage").value = '';
        displayMessage.style.color = '#13970C';
        displayMessage.innerHTML = 'Thank You! For Sending Your Query. We Will Get Back to You Soon!!';
    }
});


function isNameValid(name) {
    let regName = `^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$`;
    if (!name.match(regName)) {
        return false;
    }
    return true;
}

function isEmailValid(email){
    let regEmailId = `^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$`;
    if(!email.match(regEmailId)){
        return false;
    }
    return true;
}