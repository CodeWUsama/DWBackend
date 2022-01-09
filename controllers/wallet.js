const WalletRecord = require("../models/records");
var moment = require("moment"); // require
const Joi = require("joi");

exports.getWallet = (req, res) => {
  //results should be cash remaining, total spent today, total spent this week , income this month, expense this month

  const startOfMonth = moment().startOf("month").format("YYYY-MM-DD HH:mm:ss");
  const endOfMonth = moment().endOf("month").format("YYYY-MM-DD HH:mm:ss");
  const startOfWeek = moment().startOf("week").format("YYYY-MM-DD HH:mm:ss");
  const endOfWeek = moment().endOf("week").format("YYYY-MM-DD HH:mm:ss");
  const startOfDay = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
  const endOfDay = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");

  WalletRecord.find({
    userId: req.userId,
    date: {
      $gte: new Date(startOfMonth),
      $lt: new Date(endOfMonth),
    },
  }).then((records) => {
    let totalIncome = records.reduce(
      (partial_sum, a) =>
        a.label === "income" ? partial_sum + a.amount : partial_sum + 0,
      0
    );

    let totalExpense = records.reduce(
      (partial_sum, a) =>
        a.label === "expense" ? partial_sum + a.amount : partial_sum + 0,
      0
    );

    let cash = totalIncome - totalExpense;

    WalletRecord.find({
      userId: req.userId,
      date: {
        $gte: new Date(startOfWeek),
        $lt: new Date(endOfWeek),
      },
    }).then((records2) => {
      let totalExpenseWeek = records2.reduce(
        (partial_sum, a) =>
          a.label === "expense" ? partial_sum + a.amount : partial_sum + 0,
        0
      );

      WalletRecord.find({
        userId: req.userId,
        date: {
          $gte: new Date(startOfDay),
          $lt: new Date(endOfDay),
        },
      }).then((records3) => {
        let totalExpenseDay = records3.reduce(
          (partial_sum, a) =>
            a.label === "expense" ? partial_sum + a.amount : partial_sum + 0,
          0
        );

        return res.send({
          data: {
            cash,
            income: totalIncome,
            expense: totalExpense,
            expenseWeek: totalExpenseWeek,
            expenseDay: totalExpenseDay,
          },
        });
      });
    });
  });
};

exports.postWallet = async (req, res) => {
  let { label, title, amount, date, description } = req.body;
  let userId = req.userId;
  const schema = Joi.object().keys({
    label: Joi.string().valid("expense", "income").required(),
    title: Joi.string().required(),
    amount: Joi.number().required(),
    date: Joi.date().required(),
    description: Joi.string().allow(null, ""),
  });

  let validation = await schema.validate(req.body);
  if (validation.error) {
    return res
      .status(200)
      .send({ message: validation.error.details[0].message, error: true });
  }

  let record = new WalletRecord({
    label,
    title,
    amount,
    date,
    description,
    userId,
  });

  record
    .save()
    .then((result) => {
      return res.send({
        message: `${
          label.charAt(0).toUpperCase() + label.slice(1)
        } record is created successfully`,
      });
    })
    .catch((e) => {
      return res.status(200).send({ message: e, error: true });
    });
};

exports.getHistory = async (req, res) => {
  const startOfMonth = moment().startOf("month").format("YYYY-MM-DD HH:mm:ss");
  const endOfMonth = moment().endOf("month").format("YYYY-MM-DD HH:mm:ss");
  const startOfWeek = moment().startOf("isoWeek").format("YYYY-MM-DD HH:mm:ss");
  const endOfWeek = moment().endOf("isoWeek").format("YYYY-MM-DD HH:mm:ss");
  const startOfYear = moment().startOf("year").format("YYYY-MM-DD HH:mm:ss");
  const endOfYear = moment().endOf("year").format("YYYY-MM-DD HH:mm:ss");

  console.log(startOfWeek);
  console.log(endOfWeek);

  let userId = req.userId;

  let monthlyRecords = await WalletRecord.find({
    userId,
    date: {
      $gte: new Date(startOfMonth),
      $lt: new Date(endOfMonth),
    },
  }).sort({ date: -1 });

  let weeklyRecords = await WalletRecord.find({
    userId,
    date: {
      $gte: new Date(startOfWeek),
      $lt: new Date(endOfWeek),
    },
  }).sort({ date: -1 });

  let yearlyRecords = await WalletRecord.find({
    userId,
    date: {
      $gte: new Date(startOfYear),
      $lt: new Date(endOfYear),
    },
  }).sort({ date: -1 });

  res.send({
    data: {
      monthlyRecords,
      weeklyRecords,
      yearlyRecords,
    },
  });
};
