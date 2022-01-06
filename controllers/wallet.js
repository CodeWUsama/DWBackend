const Wallet = require("../models/records");
var moment = require('moment'); // require

exports.getWallet = (req, res) => {

    //results should be cash remaining, total spent today, total spent this week , income this month, expense this month

    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
    const startOfWeek = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
    const endOfWeek = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss');
    const startOfDay = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfDay = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

    console.log(startOfDay, endOfDay);

    Wallet.find({
        date: {
            $gte: new Date(startOfMonth),
            $lt: new Date(endOfMonth)
        }
    }).then(records => {
        let totalIncome = records.reduce((partial_sum, a) => a.label === "income" ? partial_sum + a.amount : partial_sum + 0, 0);
        let totalExpense = records.reduce((partial_sum, a) => a.label === "expense" ? partial_sum + a.amount : partial_sum + 0, 0);
        let cash = totalIncome - totalExpense;
        Wallet.find({
            date: {
                $gte: new Date(startOfWeek),
                $lt: new Date(endOfWeek)
            }
        }).then(records2 => {
            let totalExpenseWeek = records2.reduce((partial_sum, a) => a.label === "expense" ? partial_sum + a.amount : partial_sum + 0, 0);
            Wallet.find({
                date: {
                    $gte: new Date(startOfDay),
                    $lt: new Date(endOfDay)
                }
            }).then(records3 => {
                let totalExpenseDay = records3.reduce((partial_sum, a) => a.label === "expense" ? partial_sum + a.amount : partial_sum + 0, 0);
                return res.send({ cash, income: totalIncome, expense: totalExpense, expenseWeek: totalExpenseWeek, expenseDay: totalExpenseDay });
            })
        })
    })
}

exports.postWallet = (req, res) => {
    let { label, title, amount, date, description } = req.body;
    let record = new Wallet({
        label, title, amount, date, description
    });
    record.save().then(result => {
        return res.send("Record is created successfully");
    }).catch(e => {
        return res.status(500).send(e);
    })
}