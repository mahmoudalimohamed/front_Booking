import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CancelBooking = ({ bookingId }) => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleCancel = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/bookings/${bookingId}/cancel/`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setSuccess(true);
                // Optionally redirect or refresh data after a delay
                setTimeout(() => {
                    navigate('/'); // or wherever you want to redirect
                }, 1500);
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || 'Failed to cancel booking');
            } else {
                setError('Network error. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-cancel-booking">
            <h3>Cancel Booking #{bookingId}</h3>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    Booking cancelled successfully!
                </div>
            )}

            <div className="confirmation-prompt">
                <p>Are you sure you want to cancel this booking?</p>
                <p>This action cannot be undone.</p>

                <button
                    onClick={handleCancel}
                    disabled={isLoading || success}
                    className="btn btn-danger"
                >
                    {isLoading ? 'Processing...' : 'Confirm Cancellation'}
                </button>

                <button
                    onClick={() => navigate(-1)}
                    disabled={isLoading}
                    className="btn btn-secondary ml-2"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default CancelBooking;