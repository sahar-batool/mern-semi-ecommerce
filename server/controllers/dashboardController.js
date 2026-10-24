const Order = require("../Models/Order");
const Product = require("../Models/Product");
const User = require("../Models/User");

const LOW_STOCK_LIMIT = 5;

exports.getStats = async (req, res, next) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      revenueAgg,
      statusAgg,
      dailyAgg,
      totalOrders,
      totalUsers,
      newUsers,
      totalProducts,
      lowStock,
    ] = await Promise.all([
      // 1. Total revenue (paid orders only)
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),

      // 2. Orders by status
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),

      // 3. Daily sales, last 7 days (by payment date)
      Order.aggregate([
        { $match: { paidAt: { $gte: weekAgo }, isPaid: true } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
            sales: { $sum: "$totalPrice" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // 4-7. Counts
      Order.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: weekAgo } }),
      Product.countDocuments(),

      // 8. Low stock
      Product.find({ stock: { $lte: LOW_STOCK_LIMIT } })
        .select("name stock image")
        .sort("stock")
        .limit(10),
    ]);

    const ordersByStatus = {
      pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0,
    };
    statusAgg.forEach((s) => { ordersByStatus[s._id] = s.count; });

    res.json({
      totalRevenue: revenueAgg[0]?.total || 0,
      totalOrders,
      totalUsers,
      newUsers,
      totalProducts,
      ordersByStatus,
      dailySales: dailyAgg.map((d) => ({ date: d._id, sales: d.sales, orders: d.orders })),
      lowStock,
    });
  } catch (err) { next(err); }
};