class Transaction {
  constructor({ customer, car, aount, dueDate }) {
    this.customer = customer;
    this.car = car;
    this.aount = aount;
    this.dueDate = dueDate;
  }
}

module.exports = Transaction;
