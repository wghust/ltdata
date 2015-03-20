module.exports = function(moment, set, fs) {
    // var dataSchema = new mongoose.Schema({
    //     Identifier: {
    //         type: String
    //     },
    //     Business_Case_ID: {
    //         type: String
    //     },
    //     Agency_Code: {
    //         type: String
    //     },
    //     Agency_Name: {
    //         type: String
    //     },
    //     Investment_Title: {
    //         type: String
    //     },
    //     Project_ID: {
    //         type: String
    //     },
    //     Agency_Project_ID: {
    //         type: String
    //     },
    //     Project_Name: {
    //         type: String
    //     },
    //     Project_Description: {
    //         type: String
    //     },
    //     Start_Date: {
    //         type: String
    //     },
    //     Completion_Date: {
    //         type: String
    //     },
    //     Planned_Completion_Date: {
    //         type: String
    //     },
    //     Projected_Actual: {
    //         type: String
    //     },
    //     Lifecycle_Cost: {
    //         type: String
    //     },
    //     Schedule_Variance_in_day: {
    //         type: String
    //     },
    //     Schedule_Variance_precent: {
    //         type: String
    //     },
    //     Cost_Variance_m: {
    //         type: String
    //     },
    //     Cost_Variance_precent: {
    //         type: String
    //     },
    //     Planned_Cost_m: {
    //         type: String
    //     },
    //     Projected_Actual_Cost: {
    //         type: String
    //     },
    //     Updated_Date: {
    //         type: String
    //     },
    //     Updated_Time: {
    //         type: String
    //     },
    //     Unique_Project_ID: {
    //         type: String
    //     }
    // });
    // var ltData = mongoose.model('data', dataSchema);


    /**
     * [arrangeData 整理所有的数据，去掉重复的]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    arrangeData = function(callback) {
        ltData.find(function(err, results) {
            var agencys_num = 0;
            for (var i = 0; i < results.length; i++) {
                if (results[i].Agency_Name.trim() == "") {
                    arrangeData_remove(results[i]._id, function(state) {

                    });
                } else {
                    agencys_num += 1;
                }
            }
            callback(agencys_num);
        });
    },

    /**
     * [getAgency_list 获取所有Agency列表]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getAgency_list = function(callback) {
        fs.readFile('../data/data.json', {
            'encoding': 'utf-8'
        }, function(err, data) {
            var agencys = JSON.parse(data);
            var Agency = [];
            for (var i = 0; i < agencys.length; i++) {
                var isHere = false;
                for (var j = 0; j < Agency.length; j++) {
                    if (agencys[i].Agency_Name === Agency[j].Agency_Name && parseInt(agencys[i].Agency_Code) === parseInt(Agency[j].Agency_Code)) {
                        isHere = true;
                    }
                }
                if (!isHere) {
                    var newAgency = {
                        Agency_Name: agencys[i].Agency_Name,
                        Agency_Code: agencys[i].Agency_Code
                    };
                    Agency.push(newAgency);
                }
            }
            // console.log(Agency.length);
            callback(Agency);
        });

        // ltData.find(function(err, agencys) {
        //     var Agency = [];
        //     for (var i = 0; i < agencys.length; i++) {
        //         var isHere = false;
        //         for (var j = 0; j < Agency.length; j++) {
        //             if (agencys[i].Agency_Name === Agency[j].Agency_Name && parseInt(agencys[i].Agency_Code) === parseInt(Agency[j].Agency_Code)) {
        //                 isHere = true;
        //             }
        //         }
        //         if (!isHere) {
        //             var newAgency = {
        //                 Agency_Name: agencys[i].Agency_Name,
        //                 Agency_Code: agencys[i].Agency_Code
        //             };
        //             Agency.push(newAgency);
        //         }
        //     }
        //     // console.log(Agency.length);
        //     callback(Agency);
        // });
    };

    getEveryAgency_cost_plan_data = function(agency_ni, callback) {
        var cost_plan = [];
        for (var j = 0; j < agency_ni.length; j++) {
            var one_cost_plan = {
                Agency_Name: agency_ni[j].Agency_Name,
                Agency_Code: agency_ni[j].Agency_Code,
                cost: 0,
                plan: 0
            };
            cost_plan.push(one_cost_plan);
        }
        fs.readFile('../data/data.json', {
            'encoding': 'utf-8'
        }, function(err, data) {
            var agencys = JSON.parse(data);
            for (var i = 0; i < agencys.length; i++) {
                for (var j = 0; j < cost_plan.length; j++) {
                    if (parseInt(agencys[i].Agency_Code) === parseInt(cost_plan[j].Agency_Code)) {
                        cost_plan[j].cost += agencys[i].Projected_Actual_Cost == "" ? 0 : parseFloat(agencys[i].Projected_Actual_Cost);
                        cost_plan[j].plan += agencys[i].Planned_Cost_m == "" ? 0 : parseFloat(agencys[i].Planned_Cost_m);
                        break;
                    }
                }
            }
            callback(cost_plan);
            // res.json(newdata);
        });
        // ltData.find(function(err, agencys) {
        //     for (var i = 0; i < agencys.length; i++) {
        //         for (var j = 0; j < cost_plan.length; j++) {
        //             if (parseInt(agencys[i].Agency_Code) === parseInt(cost_plan[j].Agency_Code)) {
        //                 cost_plan[j].cost += agencys[i].Projected_Actual_Cost == "" ? 0 : parseInt(agencys[i].Projected_Actual_Cost);
        //                 cost_plan[j].plan += agencys[i].Planned_Cost_m == "" ? 0 : parseInt(agencys[i].Planned_Cost_m);
        //                 break;
        //             }
        //         }
        //     }
        //     callback(cost_plan);
        // });
    };

    getEveryAgency_cost_plan = function(callback) {
        getAgency_list(function(agency_ni) {
            getEveryAgency_cost_plan_data(agency_ni, function(cost_plan) {
                callback(cost_plan);
            });
        });
    };


    getInvestList = function(invests, callback) {
        var investName = [];
        for (var i = 0; i < invests.length; i++) {
            var isHas = false;
            var isHasId = 0;
            for (var j = 0; j < investName.length; j++) {
                if (investName[j].investname === invests[i].Investment_Title) {
                    isHas = true;
                    isHasId = j;
                    break;
                }
            }
            if (!isHas) {
                var pac = invests[i].Projected_Actual_Cost == "" ? 0 : parseInt(invests[i].Projected_Actual_Cost);
                var timelast = 0;
                var a_array = invests[i].Start_Date.split('/');
                var b_array = invests[i].Completion_Date.split('/');
                var a = moment([a_array[2], a_array[1], a_array[0]]);
                var b = moment([b_array[2], b_array[1], b_array[0]]);
                timelast = b.diff(a, 'days');
                var a = {
                    investname: invests[i].Investment_Title,
                    investid: invests[i].Identifier,
                    project: [{
                        projectname: invests[i].Project_Name,
                        projectid: invests[i].Project_ID,
                        cost: pac,
                        timelast: timelast
                    }]
                }
                investName.push(a);
            } else {
                var pac = invests[i].Projected_Actual_Cost == "" ? 0 : parseInt(invests[i].Projected_Actual_Cost);
                var timelast = 0;
                var a_array = invests[i].Start_Date.split('/');
                var b_array = invests[i].Completion_Date.split('/');
                var a = moment([a_array[2], a_array[1], a_array[0]]);
                var b = moment([b_array[2], b_array[1], b_array[0]]);
                timelast = b.diff(a, 'days');
                var onePoj = {
                    projectname: invests[i].Project_Name,
                    projectid: invests[i].Project_ID,
                    cost: pac,
                    timelast: timelast
                };
                investName[isHasId].project.push(onePoj);
            }
        }
        callback(investName);
    };

    getAgencyInvestmentProject = function(agency_name, callback) {
        // var name = agency_name.replace(/\_/g, " ");
        var id = agency_name;
        var invests = [];
        fs.readFile('../data/data.json', {
            'encoding': 'utf-8'
        }, function(err, data) {
            var newdata = JSON.parse(data);
            for (var i = 0; i < newdata.length; i++) {
                if (newdata[i].Agency_Code == id) {
                    invests.push(newdata[i]);
                }
            }
            getInvestList(invests, function(investDetail) {
                callback(investDetail);
            });
        });

        // ltData.find({
        //     Agency_Code: id
        // }).exec(function(err, invests) {
        //     getInvestList(invests, function(investDetail) {
        //         callback(investDetail);
        //     });
        // });
    };

    testMoment = function(callback) {
        // var a = moment.duration({
        //     days: 2,
        //     months: 6,
        //     years: 2013
        // });
        // var b = moment.duration({
        //     days: 2,
        //     months: 6,
        //     years: 2014
        // });
        // var timelast = b.subtract(a).days();
        // console.log(timelast);
        var a = moment([2007, 0, 20]);
        var b = moment([2007, 0, 29]);
        var timelast = a.diff(b, 'days');
        callback(timelast);
    };

    return {
        getAgency_list: getAgency_list,
        arrangeData: arrangeData,
        getEveryAgency_cost_plan: getEveryAgency_cost_plan,
        getAgencyInvestmentProject: getAgencyInvestmentProject,
        testMoment: testMoment
    };
};