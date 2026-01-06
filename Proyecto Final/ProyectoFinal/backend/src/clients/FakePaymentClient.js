export class FakePaymentClient {
  async createPayment(data) {
    return {
      id: 'fake_payment_id',
      status: 'approved',
      data
    };
  }
}
