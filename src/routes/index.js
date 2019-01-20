var express = require('express');
var router = express.Router();
var mongodb = require('mymongo1610')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//获取数据
router.get('/api/list', function(req, res, next) {
    var parse = req.query;
    var inputval = parse.inputval || '',
        type = parse.type || 'normal';
    var sortarr = [];
    //分页参数
    var everypage = parse.everypage * 1; //每页眼渲染几条数据
    var nowpage = parse.nowpage * 1; //现在的页数
    var sumpage;
    if (!everypage || !nowpage) {
        res.json({
            code: 3,
            mes: "参数不完整"
        })
    }
    mongodb.find('shose', { title: { $regex: inputval } }, function(err, result) {
        if (err) {
            return res.json({
                code: 0,
                mes: err
            })
        }
        //现在获取到的数据就是，全部的或者搜索的
        //将数据排序
        if (type == "normal") {
            sortarr = result;
        } else if (type == 'price') {
            sortarr = result.slice(0).sort(function(a, b) { //从低到高
                return b.price - a.price
            })
        } else if (type == 'truth') {
            sortarr = result.slice(0).sort(function(a, b) { //从高到低
                return a.truth - b.truth
            })
        } else if (type == 'num') {
            sortarr = result.slice(0).sort(function(a, b) { //从高到低
                return a.num - b.num
            })
        }

        //分页
        // 1 0 2
        // 2 3 5
        // 3 6 8
        var start = (nowpage - 1) * everypage; //开始的位置
        var end = nowpage * everypage - 1; //结束位置
        var endarr = sortarr.slice(start, end);
        sumpage = Math.ceil(endarr.length / everypage) > 0 ? Math.ceil(endarr.length / everypage) : endarr.length;

        res.json({
            code: 1,
            data: endarr,
            sumpage: sumpage
        })
    });
});
module.exports = router;