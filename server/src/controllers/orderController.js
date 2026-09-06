const Order = require('../models/Order')

// @desc    Create New Order (Customer Checkout)
// @route   POST /api/orders
exports.createOrder = async function (req, res) {
  try {
    const { customer, items, subTotal, shippingFee, totalAmount, paymentMethod } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      })
    }

    if (!customer || !customer.firstName || !customer.phone || !customer.address) {
      return res.status(400).json({
        success: false,
        message: 'Complete customer details required'
      })
    }

    const order = await Order.create({
      customer: customer,
      items: items,
      subTotal: subTotal,
      shippingFee: shippingFee || 0,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod || 'Cash on Delivery'
    })

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      orderNumber: order.orderNumber,
      order: order
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// @desc    Get All Orders (Admin Protected)
// @route   GET /api/orders
exports.getOrders = async function (req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// @desc    Update Order Status (Admin Protected)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async function (req, res) {
  try {
    const { status, adminNotes } = req.body
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    if (status) order.status = status
    if (adminNotes !== undefined) order.adminNotes = adminNotes

    await order.save()

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order: order
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
