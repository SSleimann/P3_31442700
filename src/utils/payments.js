export class CreditCardStrategy {
  async processPayment(data) {
    const {
      amount,
      cardNumber,
      cvv,
      expirationMonth,
      expirationYear,
      fullName,
      currency,
      description,
      reference,
    } = data;

    const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY;

    // Asegurar que el año tenga 4 dígitos antes de enviarlo a la API externa
    let formattedYear = String(expirationYear);
    if (formattedYear.length === 2) {
      formattedYear = `20${formattedYear}`;
    }

    const response = await fetch("https://fakepayment.onrender.com/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAYMENT_API_KEY}`,
        Accept: "application/json",
        Referer: "https://fakepayment.onrender.com/",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
      },
      body: JSON.stringify({
        amount: String(amount),
        "card-number": String(cardNumber),
        cvv: String(cvv),
        "expiration-month": String(expirationMonth),
        "expiration-year": formattedYear,
        "full-name": fullName,
        currency,
        description,
        reference,
      }),
    });

    if (!response.ok) {
      console.error("Payment processing error: ", await response.text());
      throw new Error("Payment processing failed");
    }
    return await response.json();
  }
}

export class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  async process(data) {
    if (!this.strategy) {
      throw new Error("Payment strategy not set");
    }
    return this.strategy.processPayment(data);
  }
}
