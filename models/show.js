module.exports = function(mongoose) {
    var UserSchema = new mongoose.Schema({
        uid: {
            type: Number,
            default: 0
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        username: {
            type: String
        },
        islegal: {
            type: Number,
            default: 0 //0 不合法，1 合法
        }
    });
    var User = mongoose.model('user', UserSchema);
    showUser = function(callback) {
        User.find(function(err, results) {
            callback(results);
        });
    };
    return {
        showUser: showUser
    };
};