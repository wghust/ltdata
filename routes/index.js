var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose');
var moment = require('moment');
var http = require('http');
var fs = require('fs');
var s = require('../settings');

// mongoose.connect("mongodb://" + s.host + ":" + s.port + "/" + s.db, function onMongooseError(err) {
//     if (err) {
//         throw err;
//     }
// });

var models = {
    Data: require("../models/data.js")(moment, s, fs)
}


router.get('/data/op', function(req, res) {
    fs.readFile('../data/data.json', {
        'encoding': 'utf-8'
    }, function(err, data) {
        var newdata = eval(data);
        // console.log(newdata);
        res.json(newdata);
        // for (var i = 0; i < newdata.length; i++) {
        //     delete newdata[i]._id
        // }
        // // console.log(newdata)
        // // res.json(newdata);
        // // console.log()
        // fs.writeFile('../data/data.json', JSON.stringify(newdata), {
        //     'encoding': 'utf-8'
        // }, function(err) {
        //     res.json(newdata);
        // });

    });
});
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Express'
    });
});
router.get('/save/alldata', function(req, res) {
    fs.readFile('../data/data.json', {
        'encoding': 'utf-8'
    }, function(err, data) {
        var newdata = JSON.parse(data);
        res.json(newdata);
    });
});

// 保存一条数据
router.get('/save/saveone', function(req, res) {
    models.Data.saveOneData(function(callback) {
        res.json({
            'state': callback
        });
    });
});

router.get('/delete/nullAgency', function(req, res) {
    models.Data.arrangeData(function(callback) {
        res.json({
            'length': callback
        });
    });
});

router.get('/get/getAgency', function(req, res) {
    models.Data.getAgency_list(function(callback) {
        // console.log(callback);
        res.json(callback);
    });
});

router.get('/get/getAgencyCostPlan/:type', function(req, res) {
    var type = req.param('type');
    if (parseInt(type) == 1) {
        models.Data.getEveryAgency_cost_plan(function(back) {
            var agency_name = "";
            var data_show = "";
            for (var j = 0; j < back.length; j++) {
                if (j == 0) {
                    // agency_name += "'" + back[j].Agency_Name + "'";
                    agency_name += "'" + back[j].Agency_Code + "'";
                    data_show += "{value:" + back[j].cost + ",name:'" + back[j].Agency_Code + "'}";
                } else {
                    // agency_name += ",'" + back[j].Agency_Name + "'";
                    agency_name += ",'" + back[j].Agency_Code + "'";
                    data_show += ",{value:" + back[j].cost + ",name:'" + back[j].Agency_Code + "'}";
                }
            }

            res.render('showcostplan', {
                agency_name: agency_name,
                data_show: data_show,
                charttitle: 'Actual Cost',
                precent: '52%'
                // plan_show: plan_show
            });
        });
    } else {
        if (parseInt(type) == 2) {
            models.Data.getEveryAgency_cost_plan(function(back) {
                var agency_name = "";
                var data_show = "";
                for (var j = 0; j < back.length; j++) {
                    if (j == 0) {
                        // agency_name += "'" + back[j].Agency_Name + "'";
                        agency_name += "'" + back[j].Agency_Code + "'";
                        // data_show += "{value:" + back[j].cost + ",name:'" + back[j].Agency_Name + "'}";
                        data_show += "{value:" + back[j].cost + ",name:'" + back[j].Agency_Code + "'}";
                    } else {
                        // agency_name += ",'" + back[j].Agency_Name + "'";
                        agency_name += ",'" + back[j].Agency_Code + "'";
                        // data_show += ",{value:" + back[j].cost + ",name:'" + back[j].Agency_Name + "'}";
                        data_show += ",{value:" + back[j].cost + ",name:'" + back[j].Agency_Code + "'}";
                    }
                }

                res.render('showcostplan', {
                    agency_name: agency_name,
                    data_show: data_show,
                    charttitle: 'PLAN COST',
                    precent: '55%'
                });
            });
        }
    }
});

router.get('/get/oneAgency/:agencyname/investment', function(req, res) {
    var agencyName = req.param('agencyname');
    models.Data.getAgencyInvestmentProject(agencyName, function(investList) {
        res.json(investList);
    });
});

router.get('/get/oneAgency/:agencyname/investment/all', function(req, res) {
    var agencyName = req.param('agencyname');
    models.Data.getAgencyInvestmentProject(agencyName, function(investList) {
        var investName = [];
        for (var i = 0; i < investList.length; i++) {
            var oneInvest = {
                name: investList[i].investname,
                id: investList[i].investid
            };
            investName.push(oneInvest);
        }
        res.render('allinvest', {
            agencyName: agencyName,
            investName: investName
        });
    });
});

router.get('/get/oneAgency/:agencyname/investment/:investmentid/detail', function(req, res) {
    var agencyName = req.param('agencyname');
    var investmentId = req.param('investmentid');
    models.Data.getAgencyInvestmentProject(agencyName, function(investList) {
        var investName = [],
            projectDetail = [],
            projectName = "",
            projectId = "",
            projectCost = "",
            projectTimeLast = "";
        var investmentName = "";
        for (var i = 0; i < investList.length; i++) {
            // get all Investment
            var oneInvest = {
                name: investList[i].investname,
                id: investList[i].investid
            };
            investName.push(oneInvest);

            // get one Invest's project
            if (investList[i].investid === investmentId) {
                projectDetail = investList[i].project;
                investmentName = investList[i].investname
            }
        }

        for (var i = 0; i < projectDetail.length; i++) {
            if (i == 0) {
                projectName += "'" + projectDetail[i].projectname + "'";
                projectId += projectDetail[i].projectid;
                projectCost += "-" + projectDetail[i].cost;
                var a = isNaN(parseInt(projectDetail[i].timelast)) ? 0 : parseInt(projectDetail[i].timelast);
                projectTimeLast += a;
            } else {
                projectName += ",'" + projectDetail[i].projectname + "'";
                projectId += "," + projectDetail[i].projectid;
                projectCost += ",-" + projectDetail[i].cost;
                var a = isNaN(parseInt(projectDetail[i].timelast)) ? 0 : parseInt(projectDetail[i].timelast);
                projectTimeLast += "," + a;
            }
        }
        // console.log(projectDetail);
        res.render('showinvest', {
            agencyName: agencyName,
            investName: investName,
            projectName: projectName,
            projectId: projectId,
            projectCost: projectCost,
            projectTimeLast: projectTimeLast,
            investmentName: investmentName
        });
    });
});

router.get('/test/moment', function(req, res) {
    models.Data.testMoment(function(back) {
        res.json({
            state: back
        });
    });
})


module.exports = router;