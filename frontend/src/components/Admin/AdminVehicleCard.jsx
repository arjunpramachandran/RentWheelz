import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FaEdit, FaTrash, FaClipboardList, FaCheck } from "react-icons/fa";

const AdminVehicleCard = ({ vehicle, onApprove, onUpdate, onDelete, onViewLog }) => {
  const {
    _id,
    images,
    brand,
    model,
    year,
    fuel,
    transmission,
    registrationNumber,
    status,
    pricePerDay,
    isApproved,
    driverAvailable,
    rateOfDriver,
    location,
    ownerId, 
  } = vehicle;

  return (
    <Card className="rounded-2xl shadow-md border p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Vehicle Image */}
      <div className="col-span-1 flex justify-center items-center">
        <img
          src={images[0]}
          alt={`${brand} ${model}`}
          className="w-full h-40 object-cover rounded-xl"
        />
      </div>

      {/* Vehicle Info */}
      <div className="col-span-2 space-y-1">
        <h2 className="text-xl font-semibold">{brand} {model} ({year})</h2>
        <p className="text-sm text-muted-foreground">Reg No: {registrationNumber}</p>
        <p className="text-sm">Fuel: {fuel} | Transmission: {transmission}</p>
        <p className="text-sm">Price/Day: ₹{pricePerDay}</p>
        <p className="text-sm">
          Driver: {driverAvailable ? `Yes (₹${rateOfDriver}/day)` : "Not Available"}
        </p>
        <p className="text-sm">Location: {location?.type || "N/A"}</p>
        <p className="text-sm">Status: {status}</p>

        {/* Owner Info */}
        <div className="mt-2">
          <p className="font-medium">Owner:</p>
          <p className="text-sm">Name: {ownerId?.name}</p>
          <p className="text-sm">Email: {ownerId?.email}</p>
          <p className="text-sm">Phone: {ownerId?.phone}</p>
        </div>
      </div>

      {/* Actions & Badge */}
      <div className="col-span-1 flex flex-col justify-between items-end gap-2">
        {/* Badge */}
        <Badge className={isApproved ? "bg-green-600" : "bg-yellow-500"}>
          {isApproved ? "Approved" : "Not Approved"}
        </Badge>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-2 w-full">
          {!isApproved && (
            <Button
              onClick={() => onApprove(_id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FaCheck className="mr-2" /> Approve
            </Button>
          )}
          <Button onClick={() => onUpdate(_id)} className="w-full" variant="outline">
            <FaEdit className="mr-2" /> Update
          </Button>
          <Button onClick={() => onDelete(_id)} className="w-full" variant="destructive">
            <FaTrash className="mr-2" /> Delete
          </Button>
          <Button onClick={() => onViewLog(_id)} className="w-full" variant="ghost">
            <FaClipboardList className="mr-2" /> View Log
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AdminVehicleCard;
