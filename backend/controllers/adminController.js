const User = require('../models/User')
const Vehicle = require('../models/Vehicle')
const Booking = require('../models/Booking')
const Review = require('../models/Review')
const Payment = require('../models/Payment')





const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findByIdAndDelete(id)
    if (!user) return res.status(404).json({ message: "User not found" })
    res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" })
  }
}
const getAllCustomer = async (req, res) => {
  try {
    const users = await User.find({ role: "customer" }).select("-password")
    if (!users) return res.status(404).json({ message: "No users found" })
    res.status(200).json({ message: "Customers retrieved successfully", users })


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" })

  }
}

const verifyCustomer = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );
    res.status(200).json({ message: 'User verified successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify customer' });
  }
};
const getAllHost = async (req, res) => {
  try {
    const users = await User.find({ role: "host" })
      .select("-password")
      .populate({
        path: 'vehicles',
        select: 'brand model registrationNumber _id'
      });
    if (!users) return res.status(404).json({ message: "No users found" })
    res.status(200).json({ message: "Hosts retrieved successfully", users })


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" })

  }
}

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("ownerId", "name email phone")
    if (!vehicles) return res.status(404).json({ message: "No vehicles found" })
    res.status(200).json({ message: "Vehicles retrieved successfully", vehicles })


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" })

  }
}



const approveVehicle = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const updated = await Vehicle.findByIdAndUpdate(
      vehicleId,
      { isApproved: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ message: "Vehicle approved successfully", vehicle: updated });
  } catch (err) {
    console.error("Approve vehicle error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const deleted = await Vehicle.findByIdAndDelete(vehicleId);

    if (!deleted) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error("Delete vehicle error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
    if (!reviews) return res.status(404).json({ message: "No reviews found" })
    res.status(200).json({ message: "Reviews retrieved successfully", reviews })


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" })

  }
}
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
    .populate('userId' , 'name email')
    .populate('hostId','name email')
    .populate({
      path:'bookingId',
      populate:{
        path:'vehicleId',
        select:'brand model registrationNumber'
      }
    })
    if (!payments) return res.status(404).json({ message: "No payments found" })
    res.status(200).json({ message: "Payments retrieved successfully", payments })


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" })

  }
}

// Statitics

const getAdminOverview = async (req, res) => {
  try {
    const users = await User.countDocuments({ role: 'customer' });
    const hosts = await User.countDocuments({ role: 'host' });
    const vehicles = await Vehicle.countDocuments();
    const pending = await Vehicle.countDocuments({ isApproved: false });

    res.json({ users, hosts, vehicles, pending });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching overview' });
  }
};

const getUserStats = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          role: { $in: ['customer', 'host'] },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            role: '$role',
          },
          count: { $sum: 1 },
        },
      },
    ];

    const results = await User.aggregate(pipeline);

    const monthlyStats = [];

    for (let m = 1; m <= 12; m++) {
      const monthData = {
        month: new Date(0, m - 1).toLocaleString('default', { month: 'short' }),
        users: 0,
        hosts: 0,
      };

      results.forEach(r => {
        if (r._id.month === m) {
          if (r._id.role === 'customer') monthData.users = r.count;
          if (r._id.role === 'host') monthData.hosts = r.count;
        }
      });

      monthlyStats.push(monthData);
    }

    res.json(monthlyStats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
};

const getVehicleStats = async (req, res) => {
  try {
    const statusCounts = await Vehicle.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = statusCounts.map(s => ({
      status: s._id,
      count: s.count,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicle stats' });
  }
};

const getVehicleApprovalStats = async (req, res) => {
  try {
    const approvalCounts = await Vehicle.aggregate([
      {
        $group: {
          _id: '$isApproved',
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = approvalCounts.map(entry => ({
      status: entry._id ? 'Approved' : 'Pending',
      count: entry.count,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch approval stats' });
  }
};


const getMonthlyIncome = async (req, res) => {
  try {
    const incomeData = await Booking.aggregate([
      {
        $match: {
          status: 'completed', // Only consider completed bookings
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalIncome: { $sum: "$totalBill" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

   
    const formatted = incomeData.map(item => ({
      month: `${item._id.month}-${item._id.year}`,
      income: item.totalIncome,
      bookings: item.count
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Income fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};





module.exports = { deleteUserProfile, getAllCustomer,verifyCustomer, getAllHost, getAllVehicles, approveVehicle, deleteVehicle, getAllReviews, getAllPayments, getUserStats,getMonthlyIncome, getAdminOverview, getVehicleStats, getVehicleApprovalStats }
