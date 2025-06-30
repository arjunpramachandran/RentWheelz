<Disclosure>

    <tr key={b._id} className="border-b hover:bg-gray-50">
        <td className="py-3 px-4">{b.vehicleId?.brand} {b.vehicleId?.model}</td>
        <td className="py-3 px-4">{b.userId?.name}</td>
        <td className="py-3 px-4">
            {b.userId?.email}
            <br />
            <span className="text-gray-600 text-xs">{b.userId?.phone}</span>
        </td>
        <td className="py-3 px-4">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(b.status)}`}>
                {b.status}
            </span>
        </td>
        <DisclosureButton className="py-2">View More..</DisclosureButton>
        <DisclosurePanel className="text-gray-500">
        <td className="py-3 px-4">Booking From - {pickup}...........({days} days)............. To - {dropoff}</td>
       
        <td className="py-3 px-4">Need Driver :{driver}</td>
        <td className="py-3 px-4">₹{b.totalBill}</td>
        <td className="py-3 px-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.paymentId ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {paymentStatus}
            </span>
        </td>
        </DisclosurePanel>
    </tr>
</Disclosure>

