export default function AdminDashboardPage() {
  return (
    <div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500">
          Ringkasan Bank Sampah
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white p-5 rounded-xl border">
          <p className="text-gray-500">
            Total Nasabah
          </p>

          <h2 className="text-3xl font-bold mt-2">
            -
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <p className="text-gray-500">
            Total Sampah
          </p>

          <h2 className="text-3xl font-bold mt-2">
            -
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <p className="text-gray-500">
            Total Transaksi
          </p>

          <h2 className="text-3xl font-bold mt-2">
            -
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <p className="text-gray-500">
            Total Hadiah
          </p>

          <h2 className="text-3xl font-bold mt-2">
            -
          </h2>
        </div>

      </div>

    </div>
  );
}