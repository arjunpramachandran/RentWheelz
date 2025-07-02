import { useEffect, useMemo, useState } from "react";
import { api } from "@/config/axiosinstance";
import ModalDialog from "../../components/Modal";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FaEdit, FaTrash, FaClipboardList, FaCheck } from "react-icons/fa";
import { withFormik } from "formik";
import { useNavigate } from "react-router-dom";


const ITEMS_PER_PAGE = 6;

const AdminVehicleListPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate()
    const [modalInfo, setModalInfo] = useState({
        show: false,
        type: "",
        vehicleId: null,
        message: "",
    });

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/getAllVehicles", { withCredentials: true });
            console.log(res);

            setVehicles(res.data.vehicles);
        } catch (err) {
            setError("Failed to load vehicles.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const filteredVehicles = useMemo(() => {
        return vehicles.filter((v) => {
            const searchable = [
                v.brand,
                v.model,
                v.registrationNumber,
                v.location,
                v.ownerId?.name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchable.includes(searchTerm);
        });
    }, [vehicles, searchTerm]);

    const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
    const paginatedVehicles = filteredVehicles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleApproveVehicle = async (id) => {
        try {
            await api.patch(`/admin/approveVehicle/${id}`, { withCredentials: true });
            fetchVehicles();
        } catch (err) {
            console.error("Approve failed", err);
        }
    };

    const handleDeleteVehicle = async (id) => {
        try {
            await api.delete(`/admin/deleteVehicle/${id}`, { withCredentials: true });
            fetchVehicles();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const handleModalAction = () => {
        if (modalInfo.type === "approve") {
            handleApproveVehicle(modalInfo.vehicleId);
        } else if (modalInfo.type === "delete") {
            handleDeleteVehicle(modalInfo.vehicleId);
        }
        setModalInfo({ show: false, type: "", vehicleId: null, message: "" });
    };

    const openModal = (vehicleId, type) => {
        const actionText = type === "approve" ? "approve this vehicle?" : "delete this vehicle?";
        setModalInfo({
            show: true,
            type,
            vehicleId,
            message: `Are you sure you want to ${actionText}`,
        });
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Vehicles</h1>

            {/* Search Bar */}
            <div className="mb-4">
                <Input
                    type="text"
                    placeholder="Search by owner, model, reg. number, brand, or location"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full max-w-md"
                />
            </div>

            {loading ? (
                <Loader />
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : paginatedVehicles.length === 0 ? (
                <p className="text-muted-foreground">No matching vehicles found.</p>
            ) : (
                <>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {paginatedVehicles.map((vehicle) => (
                            <div key={vehicle._id} className="rounded-2xl shadow-md border p-4 flex flex-col">
                                {/* Image */}
                                <img
                                    src={vehicle.images[0]}
                                    alt={`${vehicle.brand} ${vehicle.model}`}
                                    className="w-full h-40 object-cover rounded-xl mb-4"
                                />

                                {/* Vehicle Info */}
                                <div className="space-y-1">
                                    <h2 className="text-xl font-semibold">
                                        {vehicle.brand} {vehicle.model} ({vehicle.year})
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Reg No: {vehicle.registrationNumber}
                                    </p>
                                    <p className="text-sm">
                                        Fuel: {vehicle.fuel} | Transmission: {vehicle.transmission}
                                    </p>
                                    <p className="text-sm">Price/Day: ₹{vehicle.pricePerDay}</p>
                                    <p className="text-sm">
                                        Driver:{" "}
                                        {vehicle.driverAvailable
                                            ? `Yes (₹${vehicle.rateOfDriver}/day)`
                                            : "Not Available"}
                                    </p>
                                    <p className="text-sm">Location: {vehicle.location || "N/A"}</p>
                                    <p className="text-sm">Status: {vehicle.status}</p>
                                </div>

                                {/* Owner Info */}
                                <div className="mt-3">
                                    <p className="font-medium">Owner:</p>
                                    <p className="text-sm">Name: {vehicle.ownerId?.name}</p>
                                    <p className="text-sm">Email: {vehicle.ownerId?.email}</p>
                                    <p className="text-sm">Phone: {vehicle.ownerId?.phone}</p>
                                </div>

                                {/* Status & Buttons */}
                                <div className="mt-4 space-y-2">
                                    <Badge className={vehicle.isApproved ? "bg-green-600" : "bg-yellow-500"}>
                                        {vehicle.isApproved ? "Approved" : "Not Approved"}
                                    </Badge>

                                    {!vehicle.isApproved && (
                                        <Button
                                            onClick={() => openModal(vehicle._id, "approve")}
                                            className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                                        >
                                            <FaCheck className="mr-2" /> Approve
                                        </Button>
                                    )}

                                    <Button
                                        onClick={() => navigate(`/admin/updateVehicle/${vehicle._id}`)}
                                        className="w-full"
                                        variant="outline"
                                    >
                                        <FaEdit className="mr-2" /> Update
                                    </Button>

                                    <Button
                                        onClick={() => openModal(vehicle._id, "delete")}
                                        className="w-full"
                                        variant="destructive"
                                    >
                                        <FaTrash className="mr-2" /> Delete
                                    </Button>

                                    <Button
                                        onClick={() =>navigate(`/admin/vehicleLog/${vehicle._id}`) }
                                        className="w-full"
                                        variant="ghost"
                                    >
                                        <FaClipboardList className="mr-2" /> View Log
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center mt-6 gap-4">
                        <Button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </Button>
                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}

            {/* Modal */}
            {modalInfo.show && (
                <ModalDialog
                    title={modalInfo.type === "approve" ? "Approve Vehicle" : "Delete Vehicle"}
                    description={modalInfo.message}
                    onClose={handleModalAction}
                />
            )}
        </div>
    );
};

export default AdminVehicleListPage;
