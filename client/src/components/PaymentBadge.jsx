const PaymentBadge = ({ order }) => {
  if (order.status === 'cancelled') {
    return <span className="pay-badge cancelled">Cancelled</span>;
  }

  if (order.isPaid) {
    return <span className="pay-badge paid">Paid</span>;
  }

  return <span className="pay-badge unpaid">Pay on delivery</span>;
};

export default PaymentBadge;