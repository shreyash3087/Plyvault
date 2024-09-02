"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, Title, ArcElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setUser(data.user);
        
        if (data.user) {
          const role = data.user.role;
          if (role === 'Team Member') {
            const submissionsResponse = await fetch('/api/my-submissions');
            const submissionsData = await submissionsResponse.json();
            const totalSubmissions = submissionsData.submissions.length;
            const acceptedSubmissions = submissionsData.submissions.filter(sub => sub.status === 'approved').length;
            const rejectedSubmissions = submissionsData.submissions.filter(sub => sub.status === 'rejected').length;
            
            setStats({
              totalSubmissions,
              acceptedSubmissions,
              rejectedSubmissions
            });
          } else if (role === 'Admin') {
            const reviewsResponse = await fetch('/api/reviews');
            const reviewsData = await reviewsResponse.json();
            const totalPendingReviews = reviewsData.reviews.filter(review => review.status === 'pending').length;
            const reviewedProducts = reviewsData.reviews.filter(review => review.adminId === data.user._id).length;

            setStats({
              totalPendingReviews,
              reviewedProducts
            });
      
          }
        }
      } catch (error) {
        console.error('Error fetching profile or stats:', error);
        router.push('/login'); 
      }
    };

    fetchProfile();
  }, [router]);

  if (!user || !stats) return <p className='min-h-screen text-center'>Loading...</p>;

  return (
    <div className="container bg-gray-100 mx-auto px-12 max-sm:px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold">User Info</h2>
        <div className="mt-4">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.role === 'Team Member' && stats ? (
          <>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold">Member Stats</h2>
              <div className="mt-4">
                <p><strong>Total Submissions:</strong> {stats.totalSubmissions}</p>
                <p><strong>Accepted Submissions:</strong> {stats.acceptedSubmissions}</p>
                <p><strong>Rejected Submissions:</strong> {stats.rejectedSubmissions}</p>
                <button
                  onClick={() => router.push('/profile/my-submissions')}
                  className="bg-gray-800 text-white px-6 py-3 rounded-lg mt-4"
                >
                  View My Submissions
                </button>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center">
              <div className="w-full max-w-72">
                <Pie
                  data={{
                    labels: ['Accepted', 'Rejected', 'Pending'],
                    datasets: [{
                      data: [
                        stats.acceptedSubmissions,
                        stats.rejectedSubmissions,
                        stats.totalSubmissions - (stats.acceptedSubmissions + stats.rejectedSubmissions)
                      ],
                      backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
                    }],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || '';
                            const value = context.raw;
                            return `${label}: ${value}`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </>
        ) : user.role === 'Admin' && stats ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold">Admin Stats</h2>
            <div className="mt-4">
              <p><strong>Total Pending Reviews:</strong> {stats.totalPendingReviews}</p>
              <p><strong>Reviewed Products:</strong> {stats.reviewedProducts}</p>
              <button
                onClick={() => router.push('/pending-requests')}
                className="bg-gray-800 text-white px-6 py-3 rounded-lg mt-4"
              >
                View Pending Requests
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
