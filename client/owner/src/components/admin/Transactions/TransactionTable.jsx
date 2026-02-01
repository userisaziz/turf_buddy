import React, { useState } from "react";
import Avatar from "react-avatar";
import { ChevronUp, ChevronDown, Copy, Check, Phone } from "lucide-react";

const TransactionTable = ({
  transactions,
  sortField,
  sortDirection,
  onSort,
}) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper component for Sort Headers to reduce repetition
  const SortableHeader = ({ label, field, currentSort, direction, onSort }) => (
    <th
      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1 group">
        {label}
        <span className="text-gray-400 group-hover:text-gray-600">
          {currentSort === field ? (
            direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
          ) : (
            // Show a faint icon on hover even if not sorted
            <ChevronDown size={14} className="opacity-0 group-hover:opacity-50" />
          )}
        </span>
      </div>
    </th>
  );

  return (
    <div className="w-full bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Phone
              </th>

              <SortableHeader
                label="Date"
                field="createdAt"
                currentSort={sortField}
                direction={sortDirection}
                onSort={onSort}
              />

              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Turf
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Payment ID
              </th>

              <SortableHeader
                label="Amount"
                field="totalPrice"
                currentSort={sortField}
                direction={sortDirection}
                onSort={onSort}
              />
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr
                key={transaction._id}
                className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
              >
                {/* User Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Avatar
                        name={transaction.user.name}
                        size="40"
                        round={true}
                        className="shadow-sm"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.user.name}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Phone Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.user.phone ? (
                    <div className="flex items-center gap-2 group">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 font-mono border border-blue-100">
                        {transaction.user.phone}
                      </span>
                      <button
                        onClick={() => handleCopy(transaction.user.phone, transaction._id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none transition-all"
                        title="Copy Phone"
                      >
                        {copiedId === transaction._id ? (
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">N/A</span>
                  )}
                </td>

                {/* Date Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </div>
                </td>

                {/* Turf Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700">
                    {transaction.turf.name}
                  </span>
                </td>

                {/* Payment ID Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded select-all">
                    {transaction.payment.paymentId}
                  </span>
                </td>

                {/* Amount Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{transaction.totalPrice.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional: Empty State Handling */}
      {transactions.length === 0 && (
        <div className="text-center py-10 text-gray-500 text-sm">
          No transactions found.
        </div>
      )}
    </div>
  );
};

export default TransactionTable;