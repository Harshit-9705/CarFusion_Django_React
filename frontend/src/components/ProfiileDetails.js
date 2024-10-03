import React from 'react';

const ProfileDetails = ({ profile, formData }) => {
    return (
        <div className="grid grid-cols-1 gap-5">
            {[
                { label: 'Username', value: profile?.user.username },
                { label: 'Email', value: profile?.email },
                { label: 'Phone Number', value: profile?.phone_num },
                { label: 'Address', value: formData.address },
                { label: 'Gender', value: profile?.gender },
                { label: 'User Type', value: profile?.user_type },
                { label: 'City', value: formData.city },
            ].map(({ label, value }, index) => (
                <div className="flex justify-between items-center border-b pb-2" key={index}>
                    <span className="font-semibold text-white">{label}:</span>
                    <span className="text-gray-300">{value}</span>
                </div>
            ))}
        </div>
    );
};

export default ProfileDetails;
