import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';

const FixedScheduleList = ({ schedules, onEdit, onDelete, isLoading }) => {
    if (isLoading) {
        return <div className="text-center py-4">Loading blocked slots...</div>;
    }

    if (!schedules || schedules.length === 0) {
        return (
            <div className="text-center py-8 bg-base-200 rounded-lg mt-4">
                <p className="text-base-content/70">No active blocked time slots found.</p>
            </div>
        );
    }

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className="overflow-x-auto mt-6">
            <h3 className="text-lg font-bold mb-3">Blocked Time Slots</h3>
            <table className="table table-zebra w-full bg-base-100 shadow-md rounded-lg">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>When</th>
                        <th>Time</th>
                        <th>Reason</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map((schedule) => (
                        <tr key={schedule._id}>
                            <td>
                                <span className={`badge ${schedule.recurring ? 'badge-primary' : 'badge-secondary'} badge-sm`}>
                                    {schedule.recurring ? 'Recurring' : 'One-time'}
                                </span>
                            </td>
                            <td className="font-medium">
                                {schedule.recurring
                                    ? daysOfWeek[schedule.dayOfWeek]
                                    : schedule.date ? format(parseISO(schedule.date), 'MMM d, yyyy') : 'N/A'
                                }
                            </td>
                            <td>
                                {schedule.startTime} - {schedule.endTime}
                            </td>
                            <td className="max-w-xs truncate" title={schedule.description}>
                                {schedule.description || '-'}
                            </td>
                            <td className="flex gap-2">
                                <button
                                    className="btn btn-xs btn-outline btn-info"
                                    onClick={() => onEdit(schedule)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-xs btn-outline btn-error"
                                    onClick={() => onDelete(schedule._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FixedScheduleList;
