require('dotenv').config();
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: process.env.MODE,
  client_id: process.env.CLIENT,
  client_secret: process.env.SECRET,
});
var c;
const payprocess = (req, res) => {
  const { cost } = req.body; // Extract monthlyCost from the request body
  c = cost;
  console.log('Monthly cost received:', cost);

  var create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: 'http://localhost:3001/success',
      cancel_url: 'http://localhost:3001/cancel',
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: 'item',
              sku: 'item',
              price: cost,
              currency: 'USD',
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: 'USD',
          total: cost,
        },
        description: 'You have choosen the Best plan for you !',
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      console.log('Create Payment Response');
      console.log(payment);
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.json({ approval_url: payment.links[i].href });
        }
      }
    }
  });
};

const paySuccess = (req, res) => {
  try {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: 'USD',
            total: c,
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log(JSON.stringify(payment));
          console.log('successFull');

          res.send('Payment is successful !!!! ');
        }
      }
    );
  } catch (e) {
    console.log(e.message);
  }
};

const payCancel = (req, res) => {
  console.log('cancelled');
  res.send('payment is cancelled ! Please Try Again ');
};

module.exports = {
  payprocess,
  paySuccess,
  payCancel,
};
